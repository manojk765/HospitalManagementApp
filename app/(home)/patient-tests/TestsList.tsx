import type React from "react"
import { useState } from "react"

interface PatientService {
  patient_id: string
  service_name: string
  service_date: string
  quantity: number
  total_cost: number
  is_paid: boolean
  cost_per_unit?: number // Optional field to store the unit cost
}

interface Props {
  services: PatientService[]
  onServiceUpdated: () => void
  serviceUnitCosts: { [serviceName: string]: number } // Map of service names to their unit costs
}

const ServiceList: React.FC<Props> = ({ services, onServiceUpdated, serviceUnitCosts }) => {
  const [editingService, setEditingService] = useState<PatientService | null>(null)

  const handleDeleteService = async (service: PatientService) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await fetch(
          `/api/patient-services/delete?patient_id=${service.patient_id}&service_name=${encodeURIComponent(service.service_name)}&service_date=${service.service_date}`,
          {
            method: "DELETE",
          },
        )
        if (!response.ok) throw new Error("Failed to delete service")
        onServiceUpdated()
      } catch (error) {
        console.error("Error deleting service:", error)
        alert("Failed to delete service")
      }
    }
  }

  const handleEditService = (service: PatientService) => {
    // When editing starts, store the original service with unit cost calculated
    const unitCost = serviceUnitCosts[service.service_name] || service.total_cost / service.quantity
    setEditingService({
      ...service,
      cost_per_unit: unitCost
    })
  }

  const handleUpdateService = async (updatedService: PatientService) => {
    try {
      const response = await fetch(
        `/api/patient-services/update?patient_id=${updatedService.patient_id}&service_name=${encodeURIComponent(updatedService.service_name)}&service_date=${updatedService.service_date}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: updatedService.quantity,
            total_cost: updatedService.total_cost,
          }),
        },
      )
      if (!response.ok) throw new Error("Failed to update service")
      setEditingService(null)
      onServiceUpdated()
    } catch (error) {
      console.error("Error updating service:", error)
      alert("Failed to update service")
    }
  }

  const updateQuantityAndCost = (newQuantity: number) => {
    if (!editingService || !editingService.cost_per_unit) return
    
    const newTotalCost = editingService.cost_per_unit * newQuantity
    setEditingService({
      ...editingService,
      quantity: newQuantity,
      total_cost: newTotalCost
    })
  }

  const groupServicesByDate = (services: PatientService[]) => {
    const grouped: { [key: string]: PatientService[] } = {}
    services.forEach((service) => {
      const date = new Date(service.service_date).toISOString().split("T")[0]
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(service)
    })
    return grouped
  }

  const groupedServices = groupServicesByDate(services)

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Patient Services</h2>
      {Object.keys(groupedServices).length === 0 ? (
        <p className="text-gray-500">No services recorded for this patient.</p>
      ) : (
        Object.entries(groupedServices).map(([date, dateServices]) => (
          <div key={date} className="mb-8">
            <h3 className="text-xl font-semibold mb-2">{new Date(date).toLocaleDateString()}</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dateServices.map((service) => (
                  <tr key={`${service.service_name}-${service.service_date}`}>
                    <td className="px-6 py-4 whitespace-nowrap">{service.service_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingService?.service_name === service.service_name &&
                      editingService?.service_date === service.service_date ? (
                        <input
                          type="number"
                          value={editingService.quantity}
                          onChange={(e) => updateQuantityAndCost(Number(e.target.value))}
                          min="1"
                          className="w-20 p-1 border rounded"
                        />
                      ) : (
                        service.quantity
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingService?.service_name === service.service_name &&
                      editingService?.service_date === service.service_date ? (
                        `₹${editingService.total_cost}`
                      ) : (
                        `₹${service.total_cost.toString()}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          service.is_paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {service.is_paid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingService?.service_name === service.service_name &&
                      editingService?.service_date === service.service_date ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateService(editingService)}
                            className="bg-green-500 text-white px-2 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingService(null)}
                            className="bg-gray-500 text-white px-2 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditService(service)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteService(service)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  )
}

export default ServiceList