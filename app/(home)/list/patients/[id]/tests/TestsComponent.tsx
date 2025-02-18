"use client";

import { useState, useEffect } from "react";
import { GroupedTest } from "./page";
import test from "node:test";
import { Decimal } from 'decimal.js';

interface Test {
  test_name: string;
  test_description: string;
  cost: number;
}

interface Props {
  tests: GroupedTest[];
  patientId: string;
}

type TestsByDate = {
  [date: string]: GroupedTest[];
};

function groupTestsByDate(services: GroupedTest[]): TestsByDate {
  const grouped = services.reduce((acc: TestsByDate, service) => {
    const date = new Date(service.test_date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(service);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) =>
    new Date(a).getTime() - new Date(b).getTime()
  );

  const sortedGrouped: TestsByDate = {};
  sortedDates.forEach((date) => {
    sortedGrouped[date] = grouped[date];
  });

  return sortedGrouped;
}

function calculateDailyTotal(services: GroupedTest[]): string {
  const total = services.reduce((sum, service) => sum + Number(service.total_cost), 0);
  return total.toString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function TestsComponent({ tests: initialTests, patientId }: Props) {
  const [groupedTests, setGroupedTests] = useState<TestsByDate>(groupTestsByDate(initialTests));
  const [tests, setTests] = useState<GroupedTest[]>(initialTests);
  const [selectTests, setSelectTests] = useState<Test[]>();
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [totalCost, setTotalCost] = useState(0);
  const [canEditTotalCost, setCanEditTotalCost] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultDescription , setResultDescription ] = useState("");

  // Fetch available tests to display in dropdown
  useEffect(() => {
    async function fetchAvailableTests() {
      try {
        const res = await fetch("/api/patient-tests");
        const data = await res.json();
        setSelectTests(data);
      } catch (error) {
        console.error("Error fetching available tests:", error);
        alert("Error loading available tests.");
      }
    }

    fetchAvailableTests();
  }, []);

  // Recalculate grouped tests whenever the list of tests changes
  useEffect(() => {
    setGroupedTests(groupTestsByDate(tests));
  }, [tests]);

  // Update total cost when selected test or quantity changes
  useEffect(() => {
    if (selectedTest && quantity > 0) {
      const cost = parseFloat(selectedTest.cost.toString());
      setTotalCost(cost * quantity);
    }
  }, [selectedTest, quantity]);

  // Fetch updated tests
  const fetchUpdatedTests = async () => {
    try {
      const res = await fetch(`/api/patient/${patientId}/tests`);
      if (!res.ok) throw new Error("Failed to fetch updated services");
      const updatedServices = await res.json();
      setTests(updatedServices);
    } catch (error) {
      console.error("Error fetching updated services:", error);
      alert("Error refreshing services list.");
    }
  };
  

  // Add a new test for the patient
  const addTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTest) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/patient-tests/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: patientId,
          test_name: selectedTest.test_name,
          result_description: resultDescription,
          quantity,
          total_cost: totalCost,
        }),
      });

      if (!res.ok) throw new Error("Failed to add test");
      await fetchUpdatedTests();
      setSelectedTest(null);
      setQuantity(1);
      setTotalCost(0);
      setResultDescription("");
    } catch (error) {
      console.error("Error adding test:", error);
      alert("Error adding test.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit test function

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest , setEditingTest] = useState<GroupedTest | null>(null);

  const handleEditClick = (test : GroupedTest) => {
    setEditingTest(test);
    setIsModalOpen(true);
    setSelectedTest(selectTests?.find((t) => t.test_name === test.test_name) || null);
  };

  const handleEdit = async (updatedData : GroupedTest) => {
    try {

      const response = await fetch(`/api/patient-tests/update?patient_id=${patientId}&test_name=${updatedData.test_name}&test_date=${updatedData.test_date}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: updatedData.quantity,
          total_cost : updatedData.total_cost,
          result_description : updatedData.result_description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update class');
      }

      setIsModalOpen(false);
      await fetchUpdatedTests();
      setSelectedTest(null);
    } catch (error) {
      console.error('Error updating class:', error);
      alert('Failed to update class. Please try again.');
    }
  };


  //  Modal Component

  const handleClose = () => {
    setIsModalOpen(false);  
    setSelectedTest(null); 
  };
  
  const Modal = ({ isOpen, onClose, test, onSave }: { isOpen: boolean, onClose: ( ) => void, test: GroupedTest | null , onSave: (updatedData: GroupedTest) => void }) => {
    if (!test) return null; 

    const [quantity, setQuantity] = useState(test?.quantity || 1);
    const [totalCost, setTotalCost] = useState(Number(test?.total_cost || 0));
    const [resultDescription, setResultDescription] = useState(test?.result_description || '');
    const [canEditTotalCost, setCanEditTotalCost] = useState(false);

    useEffect(() => {
      if (test) {
        setQuantity(test.quantity);
        setTotalCost(Number(test.total_cost));
        setResultDescription(test.result_description);
      }
    }, [test]);
  
    if (!test || !isOpen) return null;
  
    
    useEffect(() => {
      if (selectedTest && quantity > 0) {
        const cost = parseFloat(selectedTest.cost.toString());
        setTotalCost(cost * quantity);
      }
    }, [selectedTest, quantity]);
  
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
    
      const updatedTest = {
        ...test,
        quantity,
        total_cost:  new Decimal(totalCost),
        result_description: resultDescription,
      };
    
      onSave(updatedTest);
    };

    if (!isOpen) return null; 
  
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Edit Test</h2>
  
            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Test Name (Read-only) */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Test Name</label>
                <input
                  type="text"
                  name="test_name"
                  value={test.test_name}
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
            
              {selectedTest && (
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
      
                  <div className="col-span-1">
                    <label htmlFor="resultDescription" className="block text-base font-semibold text-gray-700 mb-2">
                      Result Description
                    </label>
                    <input
                      type="text"
                      id="resultDescription"
                      value={resultDescription}
                      onChange={(e) => setResultDescription(e.target.value)}
                      className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                      required
                    />
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
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Tests Record</h1>
  
        {/* Add Test Form */}

        <form onSubmit={addTest} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="col-span-1">
            <label htmlFor="test" className="block text-base font-semibold text-gray-700 mb-2">
              Select Test
            </label>
            <select
              id="test"
              value={selectedTest?.test_name || ""}
              onChange={(e) => {
                const test = selectTests?.find((t) => t.test_name === e.target.value);
                setSelectedTest(test || null);
              }}
              required
              className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="">-- Select a Test --</option>
              {selectTests?.map((test) => (
                <option key={test.test_name} value={test.test_name}>
                  {test.test_name} - ₹{test.cost}
                </option>
              ))}
            </select>
          </div>
  
          <div className="col-span-1">
            <label htmlFor="quantity" className="block text-base font-semibold text-gray-700 mb-2">
              Quantity
            </label>
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
  
          {selectedTest && (
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
  
              <div className="col-span-1">
                <label htmlFor="resultDescription" className="block text-base font-semibold text-gray-700 mb-2">
                  Result Description
                </label>
                <input
                  type="text"
                  id="resultDescription"
                  value={resultDescription}
                  onChange={(e) => setResultDescription(e.target.value)}
                  className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              </div>
            </>
          )}
  
          <div className="col-span-1 md:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSubmitting ? "Adding..." : "Add Test"}
            </button>
          </div>
        </form>
  
        {/* Grouped Tests */}
        <div className="space-y-8">
      {Object.keys(groupedTests).length === 0 ? (
        <p className="text-gray-600 text-center py-8">No tests recorded for this patient.</p>
      ) : (
        Object.entries(groupedTests).map(([date, dateTests]) => (
          <div key={date} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {formatDate(date)}
                </h2>
                <span className="text-lg font-medium text-gray-700">
                  Total: ₹{calculateDailyTotal(dateTests)}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Test Quantity</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dateTests.map((test, index) => (
                    <tr key={`${test.test_name}-${test.test_date}`}>
                      <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{test.test_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{test.result_description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">{test.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        ₹{Number(test.total_cost).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            test.is_paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {test.is_paid ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          className="text-white bg-blue-500 rounded-lg px-2 py-1 m-2"
                          onClick={() => handleEditClick(test)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-white bg-red-500 rounded-lg px-2 py-1 m-2"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this test?")) {
                              fetch(`/api/patient-tests/delete?patient_id=${patientId}&test_name=${test.test_name}&test_date=${test.test_date}`, {
                                method: "DELETE"
                              })
                                .then(() => fetchUpdatedTests())
                                .catch((error) => {
                                  console.error("Error deleting test:", error);
                                  alert("Error deleting test.");
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

      {selectedTest && (
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
