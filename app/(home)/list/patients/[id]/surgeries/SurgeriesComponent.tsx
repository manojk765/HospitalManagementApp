"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { GroupedSurgery } from "./page"
import Decimal from "decimal.js"

interface Surgery {
  surgery_name: string
  cost : number
  description: string
}

interface Props {
  surgeries: GroupedSurgery[]
  patientId: string
}

type SurgeriesByDate = {
  [date: string]: GroupedSurgery[]
}

function groupSurgeriesByDate(surgeries: GroupedSurgery[]): SurgeriesByDate {
  const grouped = surgeries.reduce((acc: SurgeriesByDate, surgery) => {
    const date = new Date(surgery.surgery_date).toISOString().split("T")[0]
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(surgery)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const sortedGrouped: SurgeriesByDate = {}
  sortedDates.forEach((date) => {
    sortedGrouped[date] = grouped[date]
  })

  return sortedGrouped
}

function calculateDailyTotal(surgeries: GroupedSurgery[]): string {
  const total = surgeries.reduce((sum, surgery) => sum + Number(surgery.total_cost), 0)
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

export default function SurgeriesComponent({ surgeries: initialSurgeries, patientId }: Props) {
  const [selectSurgeries, setSelectSurgeries] = useState<Surgery[]>([])
  const [surgeries, setSurgeries] = useState<GroupedSurgery[]>(initialSurgeries)
  const [groupedSurgeries, setGroupedSurgeries] = useState<SurgeriesByDate>(groupSurgeriesByDate(initialSurgeries))
  const [selectedSurgery, setSelectedSurgery] = useState<Surgery | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [totalCost, setTotalCost] = useState(0)
  const [canEditTotalCost, setCanEditTotalCost] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [surgeryDate, setSurgeryDate] = useState("")
  const [surgeryDescription, setSurgeryDescription] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSurgery, setEditingSurgery] = useState<GroupedSurgery | null>(null)

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setSurgeryDate(today)
  }, [])

  useEffect(() => {
    async function fetchAvailableSurgeries() {
      try {
        const res = await fetch("/api/patient-surgeries")
        const data = await res.json()
        setSelectSurgeries(data)
      } catch (error) {
        console.error("Error fetching available surgeries:", error)
        alert("Error loading available surgeries.")
      }
    }

    fetchAvailableSurgeries()
  }, [])

  useEffect(() => {
    setGroupedSurgeries(groupSurgeriesByDate(surgeries))
  }, [surgeries])

  useEffect(() => {
    if (selectedSurgery && quantity > 0) {
      const cost = Number.parseFloat(selectedSurgery.cost.toString())
      setTotalCost(cost * quantity)
    }
  }, [selectedSurgery, quantity])

  const fetchUpdatedSurgeries = async () => {
    try {
      const res = await fetch(`/api/patient/${patientId}/surgeries`)
      if (!res.ok) throw new Error("Failed to fetch updated surgeries")
      const updatedSurgeries = await res.json()
      setSurgeries(updatedSurgeries)
    } catch (error) {
      console.error("Error fetching updated surgeries:", error)
      alert("Error refreshing surgeries list.")
    }
  }

  const addSurgery = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedSurgery) return

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/patient-surgeries/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: patientId,
          surgery_name: selectedSurgery.surgery_name,
          quantity,
          total_cost: totalCost,
          surgery_date: surgeryDate,
          surgery_description: surgeryDescription,
        }),
      })

      const data = await res.json()
      if (res.status === 400) {
        alert(data.error)
        setSelectedSurgery(null)
        setQuantity(1)
        setTotalCost(0)
        setCanEditTotalCost(false)
        setSurgeryDate("")
        setSurgeryDescription("")
        return
      }
      if (!res.ok) throw new Error("Failed to add surgery")

      setSelectedSurgery(null)
      setQuantity(1)
      setTotalCost(0)
      setCanEditTotalCost(false)
      const today = new Date().toISOString().split("T")[0]
      setSurgeryDate(today)
      setSurgeryDescription("")
      await fetchUpdatedSurgeries()

      alert("Surgery added successfully!")
    } catch (error) {
      console.error("Error adding surgery:", error)
      alert("Service to the day already added can edit the quantity.")
      setSelectedSurgery(null)
      setQuantity(1)
      setTotalCost(0)
      setCanEditTotalCost(false)
      const today = new Date().toISOString().split("T")[0]
      setSurgeryDate(today)
      setSurgeryDescription("")
      await fetchUpdatedSurgeries()
    } finally {
      setIsSubmitting(false)
    }
  } 

  const handleEditClick = (surgery: GroupedSurgery) => {
    setEditingSurgery(surgery)
    setIsModalOpen(true)
    setSelectedSurgery(selectSurgeries?.find((s) => s.surgery_name === surgery.surgery_name) || null)
  }

  const handleEdit = async (updatedData: GroupedSurgery) => {
    try {
      const response = await fetch(
        `/api/patient-surgeries/update?patient_id=${patientId}&surgery_name=${updatedData.surgery_name}&surgery_date=${updatedData.surgery_date}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: updatedData.quantity,
            total_cost: updatedData.total_cost,
            surgery_description: updatedData.surgery_description,
          }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to update surgery")
      }

      setIsModalOpen(false)
      await fetchUpdatedSurgeries()
      setSelectedSurgery(null)
    } catch (error) {
      console.error("Error updating surgery:", error)
      alert("Failed to update surgery. Please try again.")
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setSelectedSurgery(null)
  }

  const Modal = ({
    isOpen,
    onClose,
    surgery,
    onSave,
  }: {
    isOpen: boolean
    onClose: () => void
    surgery: GroupedSurgery | null
    onSave: (updatedData: GroupedSurgery) => void
  }) => {
    const [quantity, setQuantity] = useState(surgery?.quantity || 1)
    const [totalCost, setTotalCost] = useState(Number(surgery?.total_cost || 0))
    const [canEditTotalCost, setCanEditTotalCost] = useState(false)
    const [surgeryDescription, setSurgeryDescription] = useState(surgery?.surgery_description || "")

    useEffect(() => {
      if (surgery) {
        setQuantity(surgery.quantity)
        setTotalCost(Number(surgery.total_cost))
        setSurgeryDescription(surgery.surgery_description)
      }
    }, [surgery])

    
    useEffect(() => {
      if (selectedSurgery && quantity > 0) {
        const cost = Number.parseFloat(selectedSurgery.cost.toString())
        setTotalCost(cost * quantity)
      }
    }, [quantity])

    if (!surgery || !isOpen) return null
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      const updatedSurgery = {
        ...surgery,
        quantity,
        total_cost: new Decimal(totalCost),
        surgery_description: surgeryDescription,
      }

      onSave(updatedSurgery)
    }

    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Edit Surgery</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Surgery Name</label>
                <input
                  type="text"
                  name="surgery_name"
                  value={surgery.surgery_name}
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
                <label className="block text-sm font-medium">Surgery Description</label>
                <textarea
                  id="surgeryDescription"
                  value={surgeryDescription}
                  onChange={(e) => setSurgeryDescription(e.target.value)}
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
          <h1 className="text-3xl font-bold">Surgeries Record</h1>
        </div>

        <form onSubmit={addSurgery} className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="surgery" className="block text-sm font-medium mb-1">
              Select Surgery
            </label>
            <select
              id="surgery"
              value={selectedSurgery?.surgery_name || ""}
              onChange={(e) => {
                const surgery = selectSurgeries.find((s) => s.surgery_name === e.target.value)
                setSelectedSurgery(surgery || null)
              }}
              required
              className="block w-full p-2 border rounded"
            >
              <option value="">-- Select a Surgery --</option>
              {selectSurgeries.map((surgery) => (
                <option key={surgery.surgery_name} value={surgery.surgery_name}>
                  {surgery.surgery_name} - ₹{surgery.cost}
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
            <label className="block text-sm font-medium">Surgery Date</label>
            <input
              type="date"
              id="surgery_date"
              value={surgeryDate}
              onChange={(e) => setSurgeryDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {selectedSurgery && (
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
            <label htmlFor="surgeryDescription" className="block text-sm font-medium mb-1">
              Surgery Description
            </label>
            <textarea
              id="surgeryDescription"
              value={surgeryDescription}
              onChange={(e) => setSurgeryDescription(e.target.value)}
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
              {isSubmitting ? "Adding..." : "Add Surgery"}
            </button>
          </div>
        </form>

        <div className="space-y-8">
          {Object.keys(groupedSurgeries).length === 0 ? (
            <p className="text-gray-600 text-center py-8">No surgeries recorded for this patient.</p>
          ) : (
            Object.entries(groupedSurgeries).map(([date, dateSurgeries]) => (
              <div key={date} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">{formatDate(date)}</h2>
                    <span className="text-lg font-medium text-gray-700">
                      Total: ₹{calculateDailyTotal(dateSurgeries)}
                    </span>
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
                          Surgery Name
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Cost
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
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
                      {dateSurgeries.map((surgery, index) => (
                        <tr key={`${surgery.surgery_name}-${surgery.surgery_date}`}>
                          <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{surgery.surgery_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">{surgery.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            ₹{Number(surgery.total_cost).toFixed(2)}
                          </td>
                          <td className="px-6 py-4">{surgery.surgery_description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                surgery.is_paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {surgery.is_paid ? "Paid" : "Unpaid"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              className="text-white bg-blue-500 rounded-lg px-2 py-1 m-2"
                              onClick={() => handleEditClick(surgery)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-white bg-red-500 rounded-lg px-2 py-1 m-2"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this surgery?")) {
                                  fetch(
                                    `/api/patient-surgeries/delete?patient_id=${patientId}&surgery_name=${surgery.surgery_name}&surgery_date=${surgery.surgery_date}`,
                                    {
                                      method: "DELETE",
                                    },
                                  )
                                    .then(() => fetchUpdatedSurgeries())
                                    .catch((error) => {
                                      console.error("Error deleting surgery:", error)
                                      alert("Error deleting surgery.")
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

      {selectedSurgery && (
        <Modal isOpen={isModalOpen} onClose={handleClose} surgery={editingSurgery} onSave={handleEdit} />
      )}
    </div>
  )
}

