"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { GroupedTest } from "./page"
import Decimal from "decimal.js"

interface LabTest {
  test_name: string
  cost: number
  description: string
}

interface Props {
  tests: GroupedTest[]
  patientId: string
}

type TestsByDate = {
  [date: string]: GroupedTest[]
}

function groupTestsByDate(tests: GroupedTest[]): TestsByDate {
  const grouped = tests.reduce((acc: TestsByDate, test) => {
    const date = new Date(test.test_date).toISOString().split("T")[0]
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(test)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const sortedGrouped: TestsByDate = {}
  sortedDates.forEach((date) => {
    sortedGrouped[date] = grouped[date]
  })

  return sortedGrouped
}

function calculateDailyTotal(tests: GroupedTest[]): string {
  const total = tests.reduce((sum, test) => sum + Number(test.total_cost), 0)
  return total.toFixed(2)
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function TestsComponent({ tests: initialTests, patientId }: Props) {
  const [selectTests, setSelectTests] = useState<LabTest[]>([])
  const [tests, setTests] = useState<GroupedTest[]>(initialTests)
  const [groupedTests, setGroupedTests] = useState<TestsByDate>(groupTestsByDate(initialTests))
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [totalCost, setTotalCost] = useState(0)
  const [canEditTotalCost, setCanEditTotalCost] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testDate, setTestDate] = useState("")
  const [resultDescription, setResultDescription] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTest, setEditingTest] = useState<GroupedTest | null>(null)

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setTestDate(today)
  }, [])

  useEffect(() => {
    async function fetchAvailableTests() {
      try {
        const res = await fetch("/api/tests")
        const data = await res.json()
        setSelectTests(data)
      } catch (error) {
        console.error("Error fetching available tests:", error)
        alert("Error loading available tests.")
      }
    }

    fetchAvailableTests()
  }, [])

  useEffect(() => {
    setGroupedTests(groupTestsByDate(tests))
  }, [tests])

  useEffect(() => {
    if (selectedTest && quantity > 0) {
      const cost = Number.parseFloat(selectedTest.cost.toString())
      setTotalCost(cost * quantity)
    }
  }, [selectedTest, quantity])

  const fetchUpdatedTests = async () => {
    try {
      const res = await fetch(`/api/patient/${patientId}/tests`)
      if (!res.ok) throw new Error("Failed to fetch updated tests")
      const updatedTests = await res.json()
      setTests(updatedTests)
    } catch (error) {
      console.error("Error fetching updated tests:", error)
      alert("Error refreshing tests list.")
    }
  }

  const addTest = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedTest) return

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/patient-tests/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: patientId,
          test_name: selectedTest.test_name,
          quantity,
          total_cost: totalCost,
          test_date: testDate,
          result_description: resultDescription,
        }),
      })

      const data = await res.json()
      if (res.status === 400) {
        alert(data.error)
        setSelectedTest(null)
        setQuantity(1)
        setTotalCost(0)
        setCanEditTotalCost(false)
        setTestDate("")
        setResultDescription("")
        return
      }
      if (!res.ok) throw new Error("Failed to add test")

      setSelectedTest(null)
      setQuantity(1)
      setTotalCost(0)
      setCanEditTotalCost(false)
      const today = new Date().toISOString().split("T")[0]
      setTestDate(today)
      setResultDescription("")
      await fetchUpdatedTests()

      alert("Test added successfully!")
    } catch (error) {
      console.error("Error adding test:", error)
      alert("Test to the day is already added, can update the quantity or cost")
      setSelectedTest(null)
      setQuantity(1)
      setTotalCost(0)
      setCanEditTotalCost(false)
      const today = new Date().toISOString().split("T")[0]
      setTestDate(today)
      setResultDescription("")
      await fetchUpdatedTests()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClick = (test: GroupedTest) => {
    setEditingTest(test)
    setIsModalOpen(true)
    setSelectedTest(selectTests?.find((t) => t.test_name === test.test_name) || null)
  }

  const handleEdit = async (updatedData: GroupedTest) => {
    try {
      const response = await fetch(
        `/api/patient-tests/update?patient_id=${patientId}&test_name=${updatedData.test_name}&test_date=${updatedData.test_date}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: updatedData.quantity,
            total_cost: updatedData.total_cost,
            result_description: updatedData.result_description,
          }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to update test")
      }

      setIsModalOpen(false)
      await fetchUpdatedTests()
      setSelectedTest(null)
    } catch (error) {
      console.error("Error updating test:", error)
      alert("Failed to update test. Please try again.")
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setSelectedTest(null)
  }

  const Modal = ({
    isOpen,
    onClose,
    test,
    onSave,
  }: {
    isOpen: boolean
    onClose: () => void
    test: GroupedTest | null
    onSave: (updatedData: GroupedTest) => void
  }) => {
    const [quantity, setQuantity] = useState(test?.quantity || 1)
    const [totalCost, setTotalCost] = useState(Number(test?.total_cost || 0))
    const [canEditTotalCost, setCanEditTotalCost] = useState(false)
    const [resultDescription, setResultDescription] = useState(test?.result_description || "")

    useEffect(() => {
      if (test) {
        setQuantity(test.quantity)
        setTotalCost(Number(test.total_cost))
        setResultDescription(test.result_description)
      }
    }, [test])

    if (!test || !isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      const updatedTest = {
        ...test,
        quantity,
        total_cost: new Decimal(totalCost),
        result_description: resultDescription,
      }

      onSave(updatedTest)
    }

    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Edit Test</h2>

            <form onSubmit={handleSubmit}>
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

              <div className="mb-4">
                <label className="block text-sm font-medium">Total Cost</label>
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

              <div className="mb-4">
                <label className="block text-sm font-medium">Result Description</label>
                <textarea
                  id="resultDescription"
                  value={resultDescription}
                  onChange={(e) => setResultDescription(e.target.value)}
                  className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  rows={3}
                  required
                />
              </div>

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
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tests Record</h1>
        </div>

        <form onSubmit={addTest} className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="test" className="block text-sm font-medium mb-1">
              Select Test
            </label>
            <select
              id="test"
              value={selectedTest?.test_name || ""}
              onChange={(e) => {
                const test = selectTests.find((t) => t.test_name === e.target.value)
                setSelectedTest(test || null)
              }}
              required
              className="block w-full p-2 border rounded"
            >
              <option value="">-- Select a Test --</option>
              {selectTests.map((test) => (
                <option key={test.test_name} value={test.test_name}>
                  {test.test_name} - ₹{test.cost}
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
            <label className="block text-sm font-medium">Test Date</label>
            <input
              type="date"
              id="test_date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {selectedTest && (
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

          <div className="flex-1 min-w-[200px]">
            <label htmlFor="resultDescription" className="block text-sm font-medium mb-1">
              Result Description
            </label>
            <textarea
              id="resultDescription"
              value={resultDescription}
              onChange={(e) => setResultDescription(e.target.value)}
              className="block w-full p-2 border rounded"
              rows={3}
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSubmitting ? "Adding..." : "Add Test"}
            </button>
          </div>
        </form>

        <div className="space-y-8">
          {Object.keys(groupedTests).length === 0 ? (
            <p className="text-gray-600 text-center py-8">No tests recorded for this patient.</p>
          ) : (
            Object.entries(groupedTests).map(([date, dateTests]) => (
              <div key={date} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">{formatDate(date)}</h2>
                    <span className="text-lg font-medium text-gray-700">Total: ₹{calculateDailyTotal(dateTests)}</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No.
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Test Name
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Cost
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Result Description
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dateTests.map((test, index) => (
                        <tr key={`${test.test_name}-${test.test_date}`}>
                          <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{test.test_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">{test.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            ₹{Number(test.total_cost).toFixed(2)}
                          </td>
                          <td className="px-6 py-4">{test.result_description}</td>
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
                                  fetch(
                                    `/api/patient-tests/delete?patient_id=${patientId}&test_name=${test.test_name}&test_date=${test.test_date}`,
                                    {
                                      method: "DELETE",
                                    },
                                  )
                                    .then(() => fetchUpdatedTests())
                                    .catch((error) => {
                                      console.error("Error deleting test:", error)
                                      alert("Error deleting test.")
                                    })
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

      {selectedTest && <Modal isOpen={isModalOpen} onClose={handleClose} test={editingTest} onSave={handleEdit} />}
    </div>
  )
}
