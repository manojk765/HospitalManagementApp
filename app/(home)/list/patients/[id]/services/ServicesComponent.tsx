"use client";

import { useState, useEffect } from "react";
import { GroupedService } from "./page";
import Decimal from "decimal.js";

interface Service {
  service_name: string;
  cost: number;
  description: string;
}

interface Props {
  services: GroupedService[];
  patientId: string;
}

type ServicesByDate = {
  [date: string]: GroupedService[];
};

function groupServicesByDate(services: GroupedService[]): ServicesByDate {
  const grouped = services.reduce((acc: ServicesByDate, service) => {
    const date = new Date(service.service_date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(service);
    return acc;
  }, {});

  // Sort dates in ascending order
  const sortedDates = Object.keys(grouped).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Create a new object with sorted dates
  const sortedGrouped: ServicesByDate = {};
  sortedDates.forEach(date => {
    sortedGrouped[date] = grouped[date];
  });

  return sortedGrouped;
}

function calculateDailyTotal(services: GroupedService[]): string {
  const total = services.reduce((sum, service) => sum + Number(service.total_cost), 0);
  return total.toFixed(2);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function ServicesComponent({ services: initialServices, patientId }: Props) {
  const [selectServices, setSelectServices] = useState<Service[]>([]);
  const [services, setServices] = useState<GroupedService[]>(initialServices);
  const [groupedServices, setGroupedServices] = useState<ServicesByDate>(
    groupServicesByDate(initialServices)
  );
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [totalCost, setTotalCost] = useState(0);
  const [canEditTotalCost, setCanEditTotalCost] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceDate, setServiceDate] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; 
    setServiceDate(today); 
  }, []);

  // Fetch available services when component mounts
  useEffect(() => {
    async function fetchAvailableServices() {
      try {
        const res = await fetch("/api/patient-services");
        const data = await res.json();
        setSelectServices(data);
      } catch (error) {
        console.error("Error fetching available services:", error);
        alert("Error loading available services.");
      }
    }

    fetchAvailableServices();
  }, []);

  // Update grouped services whenever services change
  useEffect(() => {
    setGroupedServices(groupServicesByDate(services));
  }, [services]);

  // Update total cost when selectedService or quantity changes
  useEffect(() => {
    if (selectedService && quantity > 0) {
      const cost = parseFloat(selectedService.cost.toString());
      setTotalCost(cost * quantity);
    }
  }, [selectedService, quantity]);

  // Function to fetch updated services
  const fetchUpdatedServices = async () => {
    try {
      const res = await fetch(`/api/patient/${patientId}/services`);
      if (!res.ok) throw new Error("Failed to fetch updated services");
      const updatedServices = await res.json();
      setServices(updatedServices);
    } catch (error) {
      console.error("Error fetching updated services:", error);
      alert("Error refreshing services list.");
    }
  };

  // Function to add service
  const addService = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/patient-services/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: patientId,
          service_name: selectedService.service_name,
          quantity,
          total_cost: totalCost,
          service_date: serviceDate
        }),
      });

      const data = await res.json();
      if (res.status === 400) {
        alert(data.error);
        setSelectedService(null);
        setQuantity(1);
        setTotalCost(0);
        setCanEditTotalCost(false);
        const today = new Date().toISOString().split('T')[0]; 
        setServiceDate(today); 
        return;
      }
      if (!res.ok) throw new Error("Failed to add service");

      setSelectedService(null);
      setQuantity(1);
      setTotalCost(0);
      setCanEditTotalCost(false);
      const today = new Date().toISOString().split('T')[0]; 
      setServiceDate(today); 
      await fetchUpdatedServices();
      
      alert("Service added successfully!");
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Error adding service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to update service

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest , setEditingTest] = useState<GroupedService | null>(null);
  
    const handleEditClick = (test : GroupedService) => {
      setEditingTest(test);
      setIsModalOpen(true);
      setSelectedService(selectServices?.find((t) => t.service_name === test.service_name) || null);
    };
  
    const handleEdit = async (updatedData : GroupedService) => {
      try {
  
        const response = await fetch(`/api/patient-services/update?patient_id=${patientId}&service_name=${updatedData.service_name}&service_date=${updatedData.service_date}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quantity: updatedData.quantity,
            total_cost : updatedData.total_cost
          }),
        }); 
  
        if (!response.ok) {
          throw new Error('Failed to update class');
        }
  
        setIsModalOpen(false);
        await fetchUpdatedServices();
        setSelectedService(null);
      } catch (error) {
        console.error('Error updating class:', error);
        alert('Failed to update class. Please try again.');
      }
    };
  
  
    //  Modal Component
  
    const handleClose = () => {
      setIsModalOpen(false);  
      setSelectedService(null); 
    };
    
    const Modal = ({ isOpen, onClose, test, onSave }: { isOpen: boolean, onClose: ( ) => void, test: GroupedService | null , onSave: (updatedData: GroupedService) => void }) => {
      if (!test) return null; 
  
      const [quantity, setQuantity] = useState(test?.quantity || 1);
      const [totalCost, setTotalCost] = useState(Number(test?.total_cost || 0));
      const [canEditTotalCost, setCanEditTotalCost] = useState(false);
  
      useEffect(() => {
        if (test) {
          setQuantity(test.quantity);
          setTotalCost(Number(test.total_cost));
        }
      }, [test]);
    
      if (!test || !isOpen) return null;
    
      
      useEffect(() => {
        if (selectedService && quantity > 0) {
          const cost = parseFloat(selectedService.cost.toString());
          setTotalCost(cost * quantity);
        }
      }, [selectedService, quantity]);
    
      
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
      
        const updatedTest = {
          ...test,
          quantity,
          total_cost:  new Decimal(totalCost),
        };
      
        onSave(updatedTest);
      };
  
      if (!isOpen) return null; 
    
      return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Edit Service</h2>
    
              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Service Name (Read-only) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium">Service Name</label>
                  <input
                    type="text"
                    name="service_name"
                    value={test.service_name}
                    disabled
                    className="w-full px-3 py-2 border rounded-lg bg-gray-200"
                  />
                </div>
    
                {/* Quantity */}
                <div className="mb-4">
                  <label className="block text-sm font-medium">Quantity</label>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      min="1"
                      className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                      required
                    />
                </div> 

                {selectedService && (
                  <>
                    <div className="col-span-1 md:col-span-2">
                      <label htmlFor="totalCost" className="block text-base font-semibold text-gray-700 mb-2">
                        Total Cost
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          id="totalCost"
                          value={totalCost} 
                          onChange={(e) => setTotalCost(Number(e.target.value))}
                          disabled={!canEditTotalCost}
                          className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                        />
                        <button
                          type="button"
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            canEditTotalCost
                              ? "bg-blue-500 text-white hover:bg-blue-600"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          onClick={() => setCanEditTotalCost(!canEditTotalCost)}
                        >
                          {canEditTotalCost ? "Lock" : "Edit"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
    
                <div className="flex justify-end space-x-3">
                  <button type="button" className="px-4 py-2 bg-gray-300 rounded-lg" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Services Record</h1>
        </div>

        {/* Form section */}
        <form onSubmit={addService} className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="service" className="block text-sm font-medium mb-1">
              Select Service
            </label>
            <select
              id="service"
              value={selectedService?.service_name || ""}
              onChange={(e) => {
                const service = selectServices.find(
                  (s) => s.service_name === e.target.value
                );
                setSelectedService(service || null);
              }}
              required
              className="block w-full p-2 border rounded"
            >
              <option value="">-- Select a Service --</option>
              {selectServices.map((service) => (
                <option key={service.service_name} value={service.service_name}>
                  {service.service_name} - ₹{service.cost}
                </option>
              ))}
            </select>
          </div>

          <div className="w-32">
            <label htmlFor="quantity" className="block text-sm font-medium mb-1">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              className="block w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
          <label className="block text-sm font-medium">Service Date</label>
                  <input
                    type="date"
                    id="service_date"
                    value={serviceDate} 
                    onChange={(e) => setServiceDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    required
                  />
                </div>    
              

          {selectedService && (
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="totalCost" className="block text-sm font-medium mb-1">
                Total Cost
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="totalCost"
                  value={totalCost}
                  onChange={(e) => setTotalCost(Number(e.target.value))}
                  disabled={!canEditTotalCost}
                  className="block w-full p-2 border rounded"
                />
                <button
                  type="button"
                  className="bg-gray-200 text-black px-3 py-2 rounded hover:bg-gray-300"
                  onClick={() => setCanEditTotalCost(!canEditTotalCost)}
                >
                  {canEditTotalCost ? "Lock" : "Edit"}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSubmitting ? "Adding..." : "Add Service"}
            </button>
          </div>
        </form>

        {/* Display services */}
        <div className="space-y-8">
          {Object.keys(groupedServices).length === 0 ? (
            <p className="text-gray-600 text-center py-8">No services recorded for this patient.</p>
          ) : (
            Object.entries(groupedServices).map(([date, dateServices]) => (
              <div key={date} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {formatDate(date)}
                    </h2>
                    <span className="text-lg font-medium text-gray-700">
                      Total: ₹{calculateDailyTotal(dateServices)}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dateServices.map((service, index) => (
                        <tr key={`${service.service_name}-${service.service_date}`}>
                          <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{service.service_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">{service.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            ₹{Number(service.total_cost).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                service.is_paid
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {service.is_paid ? "Paid" : "Unpaid"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                                className="text-white bg-blue-500 rounded-lg px-2 py-1 m-2"
                                onClick={() => handleEditClick(service)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-white bg-red-500 rounded-lg px-2 py-1 m-2 "
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this service?")) {
                                  fetch(`/api/patient-services/delete?patient_id=${patientId}&service_name=${service.service_name}&service_date=${service.service_date}`, {
                                    method: "DELETE"
                                  })
                                    .then(() => fetchUpdatedServices())
                                    .catch((error) => {
                                      console.error("Error deleting service:", error);
                                      alert("Error deleting service.");
                                    });
                                }
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
        
      </div>

      {selectedService && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleClose}
          test={editingTest}
          onSave={handleEdit}  
        />
      )}


    </div>
  );
}