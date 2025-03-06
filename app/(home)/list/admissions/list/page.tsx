"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { Plus, Edit2, Search, X , Trash2} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Pagination from "@/components/pagination"

interface Patient {
  patient_id: string
  name: string
  email: string
}

interface Room {
  id: string
  type: string
  bedNumber: string
  dailyRate: number
  available: boolean
}

interface Admission {
  patient_id: string
  room_id: string
  admittedDate: string
  dischargeDate: string | null
}

interface AdmissionFormData {
  patient_id: string
  room_id: string
  admittedDate: string
}

const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="flex min-h-screen items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

        <div
          className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

// Loading component for Suspense
const AdmissionsLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)

// Client component that uses useSearchParams
const AdmissionsContent = () => {
  const ITEMS_PER_PAGE = 8
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const currentPage = Number(searchParams.get("page") || "1")

  const [patients, setPatients] = useState<Patient[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [admissions, setAdmissions] = useState<Admission[]>([])
  const [filteredAdmissions, setFilteredAdmissions] = useState<Admission[]>([])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingAdmission, setEditingAdmission] = useState<Admission | null>(null)

  const [selectedPatient, setSelectedPatient] = useState("")
  const [selectedRoom, setSelectedRoom] = useState("")
  const [admittedDate, setAdmittedDate] = useState("")
  const [searchTerm, setSearchTerm] = useState(searchQuery)

  const [totalCost, setTotalCost] = useState(0)
  const [canEditTotalCost, setCanEditTotalCost] = useState(false)
  const [dischargeDate, setDischargeDate] = useState("")
  const [totalDays, setTotalDays] = useState(0)

  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
   const [deletingAdmission, setDeletingAdmission] = useState<Admission | null>(null)

  // Initialize admitted date to today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setAdmittedDate(today)
  }, [])

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [patientsResponse, roomsResponse, admissionsResponse] = await Promise.all([
          fetch("/api/patient"),
          fetch("/api/rooms"),
          fetch("/api/admissions"),
        ])

        if (!patientsResponse.ok || !roomsResponse.ok || !admissionsResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const patientsData: Patient[] = await patientsResponse.json()
        const roomsData: Room[] = await roomsResponse.json()
        const admissionsData: Admission[] = await admissionsResponse.json()

        setPatients(patientsData)
        setRooms(roomsData)
        setAdmissions(admissionsData)
      } catch (err) {
        setError("Failed to load data. Please try again.")
        console.error("Error fetching data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter admissions based on search query
  useEffect(() => {
    setSearchTerm(searchQuery)

    if (!searchQuery || !admissions.length) {
      setFilteredAdmissions(admissions.filter((admission) => !admission.dischargeDate))
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = admissions.filter((admission) => {
      // Only show active admissions (not discharged)
      if (admission.dischargeDate) return false

      const patient = patients.find((p) => p.patient_id === admission.patient_id)
      const room = rooms.find((r) => r.id === admission.room_id)

      return (
        patient?.name.toLowerCase().includes(query) ||
        patient?.patient_id.toLowerCase().includes(query) ||
        room?.type.toLowerCase().includes(query) ||
        room?.bedNumber.toLowerCase().includes(query)
      )
    })

    setFilteredAdmissions(filtered)
  }, [admissions, patients, rooms, searchQuery])

  // Get paginated admissions
  const getPaginatedAdmissions = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredAdmissions.slice(startIndex, endIndex)
  }

  // Handle search form submission
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm) {
      params.set("search", searchTerm)
    } else {
      params.delete("search")
    }
    params.set("page", "1")

    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  // Fetch updated admissions
  const fetchUpdatedAdmissions = async () => {
    try {
      const admissionsResponse = await fetch("/api/admissions")
      if (!admissionsResponse.ok) throw new Error("Failed to fetch admissions")

      const admissionsData = await admissionsResponse.json()
      setAdmissions(admissionsData)
    } catch (err) {
      setError("Failed to load updated admissions. Please try again.")
      console.error("Error fetching data:", err)
    }
  }

  // Handle add admission form submission
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      setError(null)

      const formData: AdmissionFormData = {
        patient_id: selectedPatient,
        room_id: selectedRoom,
        admittedDate,
      }

      const response = await fetch("/api/admissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Admission failed")
      }

      const roomResponse = await fetch(`/api/rooms/${selectedRoom}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ available: false }),
      })

      if (!roomResponse.ok) {
        throw new Error("Failed to update room availability")
      }

      setSuccessMessage("Patient admitted successfully!")
      resetAddForm()
      setIsAddModalOpen(false)
      await fetchUpdatedAdmissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admission failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit admission
  const handleEditClick = (admission: Admission) => {
    setEditingAdmission(admission)
    setDischargeDate(new Date().toISOString().split("T")[0])

    // Calculate total days and cost
    const room = rooms.find((r) => r.id === admission.room_id)
    if (room) {
      const admittedDate = new Date(admission.admittedDate)
      const today = new Date()
      const days = Math.ceil((today.getTime() - admittedDate.getTime()) / (1000 * 60 * 60 * 24))
      setTotalDays(days)
      setTotalCost(days * room.dailyRate)
    }

    setIsEditModalOpen(true)
  }

  // Handle discharge patient (edit admission)
  const handleDischargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingAdmission || isSubmitting) return

    try {
      setIsSubmitting(true)
      setError(null)

      // Update admission with discharge date
      const response = await fetch(
        `/api/admissions/update?patientId=${editingAdmission.patient_id}&roomId=${editingAdmission.room_id}&admittedDate=${editingAdmission.admittedDate}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dischargeDate: dischargeDate,
          }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to update admission")
      }

      // Update room availability
      const roomResponse = await fetch(`/api/rooms/${editingAdmission.room_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ available: true }),
      })

      if (!roomResponse.ok) {
        throw new Error("Failed to update room availability")
      }

      // Create admission fee record
      const totalDaysCalc =
        Math.ceil(
          (new Date(dischargeDate).getTime() - new Date(editingAdmission.admittedDate).getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1

      const feeResponse = await fetch("/api/admission-fee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: editingAdmission.patient_id,
          room_id: editingAdmission.room_id,
          admittedDate: editingAdmission.admittedDate,
          dischargeDate: dischargeDate,
          totalDays: totalDaysCalc,
          totalCost,
        }),
      })

      if (!feeResponse.ok) {
        throw new Error("Failed to create admission fee")
      }

      setSuccessMessage("Patient discharged successfully!")
      setIsEditModalOpen(false)
      setEditingAdmission(null)
      await fetchUpdatedAdmissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Discharge failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset add form
  const resetAddForm = () => {
    const today = new Date().toISOString().split("T")[0]
    setSelectedPatient("")
    setSelectedRoom("")
    setAdmittedDate(today)
  }

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  
  // Update total days and cost when discharge date changes
  useEffect(() => {
    if (editingAdmission && dischargeDate) {
      const admittedDate = new Date(editingAdmission.admittedDate)
      const discharge = new Date(dischargeDate)
      const days = Math.ceil((discharge.getTime() - admittedDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
      setTotalDays(days)

      // Update total cost based on daily rate
      const room = rooms.find((r) => r.id === editingAdmission?.room_id)
      if (room) {
        setTotalCost(days * room.dailyRate)
      }
    }
  }, [editingAdmission, dischargeDate, rooms])

  // Clear notifications after 3 seconds
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError(null)
        setSuccessMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, successMessage])



  // Handle delete admission
const handleDeleteClick = (admission: Admission) => {
    setDeletingAdmission(admission)
    setIsDeleteModalOpen(true)
  }

  // Handle delete admission submission
const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (!deletingAdmission || isSubmitting) return
  
    try {
      setIsSubmitting(true)
      setError(null)
  
      // Delete the admission
      const response = await fetch(
        `/api/admissions/delete?patientId=${deletingAdmission.patient_id}&roomId=${deletingAdmission.room_id}&admittedDate=${new Date(deletingAdmission.admittedDate).toISOString()}`,
        {
          method: "DELETE",
        }
      )
  
      if (!response.ok) {
        throw new Error("Failed to delete admission")
      }
  
      // Update room availability
      const roomResponse = await fetch(`/api/rooms/${deletingAdmission.room_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ available: true }),
      })
  
      if (!roomResponse.ok) {
        throw new Error("Failed to update room availability")
      }
  
      setSuccessMessage("Admission deleted successfully!")
      setIsDeleteModalOpen(false)
      setDeletingAdmission(null)
      await fetchUpdatedAdmissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deletion failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {(error || successMessage) && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 p-4 rounded-2xl shadow-lg transition-all duration-500 text-white w-full max-w-md ${
            error ? "bg-red-600" : "bg-green-600"
          }`}
          role="alert"
        >
          <p className="text-center text-lg font-semibold">{error || successMessage}</p>
        </div>
      )}

      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Patient Admissions</h1>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? `Found ${filteredAdmissions.length} active admissions matching "${searchQuery}"`
              : `You have ${filteredAdmissions.length} active admissions`}
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
          >
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search admissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[200px] p-2 bg-transparent outline-none"
            />
            {searchTerm && (
              <button type="button" onClick={clearSearch} className="p-1 text-gray-500 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            )}
            <button type="submit" className="hidden">
              Search
            </button>
          </form>

          {/* Add New Admission Button */}
          <button
            onClick={() => {
              resetAddForm()
              setIsAddModalOpen(true)
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <Plus className="w-5 h-5" />
            New Admission
          </button>
        </div>
      </div>

      {/* Admissions Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left text-sm font-medium text-gray-700">Patient</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Room</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Admitted Date</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="p-3 text-center text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getPaginatedAdmissions().length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  {searchQuery ? `No admissions found matching "${searchQuery}"` : "No active admissions found"}
                </td>
              </tr>
            ) : (
              getPaginatedAdmissions().map((admission) => {
                const patient = patients.find((p) => p.patient_id === admission.patient_id)
                const room = rooms.find((r) => r.id === admission.room_id)
                return (
                  <tr
                    key={`${admission.patient_id}-${admission.room_id}-${admission.admittedDate}`}
                    className="border-b hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-3 text-sm text-gray-700">
                      <div className="font-medium">{patient?.name || "Unknown"}</div>
                      <div className="text-xs text-gray-500">{admission.patient_id}</div>
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {room ? (
                        <div>
                          <div>{room.type}</div>
                          <div className="text-xs text-gray-500">
                            Bed #{room.bedNumber} - ₹{room.dailyRate}/day
                          </div>
                        </div>
                      ) : (
                        "Unknown"
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-700">{formatDate(admission.admittedDate)}</td>
                    <td className="p-3 text-sm text-gray-700">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="p-3 flex justify-center">
                      <button
                        onClick={() => handleEditClick(admission)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded transition duration-200"
                        title="Discharge patient"
                      >
                        <Edit2 size={18} />
                      </button>
                        <button
                            onClick={() => handleDeleteClick(admission)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition duration-200"
                            title="Delete admission"
                        >
                            <Trash2 size={18} />
                        </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {filteredAdmissions.length > 0 && <Pagination page={currentPage} count={filteredAdmissions.length} />}

      {/* Add Admission Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          resetAddForm()
          setIsAddModalOpen(false)
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800" id="modal-title">
              New Patient Admission
            </h2>
            <button
              onClick={() => {
                resetAddForm()
                setIsAddModalOpen(false)
              }}
              className="text-gray-400 hover:text-gray-500 transition-colors"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="patient" className="block text-sm font-medium text-gray-700">
                Select Patient
              </label>
              <select
                id="patient"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                required
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.patient_id} value={patient.patient_id}>
                    {patient.patient_id} - {patient.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="room" className="block text-sm font-medium text-gray-700">
                Select Room/Bed
              </label>
              <select
                id="room"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                required
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a room/bed</option>
                {rooms
                  .filter((room) => room.available)
                  .map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.type} - Bed #{room.bedNumber} (₹{room.dailyRate}/day)
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="admittedDate" className="block text-sm font-medium text-gray-700">
                Admitted Date
              </label>
              <input
                type="date"
                id="admittedDate"
                value={admittedDate}
                onChange={(e) => setAdmittedDate(e.target.value)}
                required
                max={new Date().toISOString().split("T")[0]}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  resetAddForm()
                  setIsAddModalOpen(false)
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></div>
                    Admitting...
                  </span>
                ) : (
                  "Admit Patient"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Edit/Discharge Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingAdmission(null)
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800" id="modal-title">
              Discharge Patient
            </h2>
            <button
              onClick={() => {
                setIsEditModalOpen(false)
                setEditingAdmission(null)
              }}
              className="text-gray-400 hover:text-gray-500 transition-colors"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleDischargeSubmit} className="space-y-4">
            {/* Patient Info */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Patient</label>
              <input
                value={patients.find((p) => p.patient_id === editingAdmission?.patient_id)?.name || ""}
                disabled
                className="w-full border rounded-lg p-2 bg-gray-50 text-gray-700"
              />
              <div className="text-xs text-gray-500">{editingAdmission?.patient_id}</div>
            </div>

            {/* Room Info */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Room</label>
              {(() => {
                const room = rooms.find((r) => r.id === editingAdmission?.room_id)
                return (
                  <input
                    value={room ? `${room.type} - Bed #${room.bedNumber} (₹${room.dailyRate}/day)` : ""}
                    disabled
                    className="w-full border rounded-lg p-2 bg-gray-50 text-gray-700"
                  />
                )
              })()}
            </div>

            {/* Admitted Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Admitted Date</label>
              <input
                type="date"
                value={editingAdmission ? new Date(editingAdmission.admittedDate).toISOString().split("T")[0] : ""}
                disabled
                className="w-full border rounded-lg p-2 bg-gray-50 text-gray-700"
              />
            </div>

            {/* Discharge Date */}
            <div className="space-y-2">
              <label htmlFor="dischargeDate" className="block text-sm font-medium text-gray-700">
                Discharge Date
              </label>
              <input
                type="date"
                id="dischargeDate"
                value={dischargeDate}
                onChange={(e) => setDischargeDate(e.target.value)}
                required
                min={editingAdmission?.admittedDate?.toString().split("T")[0]}
                max={new Date().toISOString().split("T")[0]}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Total Days */}
            {dischargeDate && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Total Days</label>
                <input value={totalDays} disabled className="w-full border rounded-lg p-2 bg-gray-50 text-gray-700" />
              </div>
            )}

            {/* Total Cost */}
            {dischargeDate && (
              <div className="space-y-2">
                <label htmlFor="totalCost" className="block text-sm font-medium text-gray-700">
                  Total Cost (₹)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="totalCost"
                    value={totalCost}
                    onChange={(e) => setTotalCost(Number(e.target.value))}
                    disabled={!canEditTotalCost}
                    className={`w-full border rounded-lg p-2 ${
                      canEditTotalCost
                        ? "focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-50 text-gray-700"
                    }`}
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
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false)
                  setEditingAdmission(null)
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  "Discharge Patient"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
<Modal
  isOpen={isDeleteModalOpen}
  onClose={() => {
    setIsDeleteModalOpen(false)
    setDeletingAdmission(null)
  }}
>
  <div className="p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-800" id="modal-title">
        Delete Admission
      </h2>
      <button
        onClick={() => {
          setIsDeleteModalOpen(false)
          setDeletingAdmission(null)
        }}
        className="text-gray-400 hover:text-gray-500 transition-colors"
        aria-label="Close modal"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div className="mb-6">
      <p className="text-gray-700">Are you sure you want to delete this admission?</p>
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="font-medium">
          {patients.find((p) => p.patient_id === deletingAdmission?.patient_id)?.name}
        </p>
        <p className="text-sm text-gray-500">
          {rooms.find((r) => r.id === deletingAdmission?.room_id)?.type} - 
          Bed #{rooms.find((r) => r.id === deletingAdmission?.room_id)?.bedNumber}
        </p>
        <p className="text-sm text-gray-500">
          Admitted: {deletingAdmission ? formatDate(deletingAdmission.admittedDate) : ""}
        </p>
      </div>
      <p className="mt-4 text-red-600 text-sm">
        This action cannot be undone. The room will be marked as available.
      </p>
    </div>

    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={() => {
          setIsDeleteModalOpen(false)
          setDeletingAdmission(null)
        }}
        className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition duration-200"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleDeleteSubmit}
        disabled={isSubmitting}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></div>
            Deleting...
          </span>
        ) : (
          "Delete Admission"
        )}
      </button>
    </div>
  </div>
</Modal>
    </div>
  )
}

export default function AdmissionPage() {
  return (
    <Suspense fallback={<AdmissionsLoading />}>
      <AdmissionsContent />
    </Suspense>
  )
}

