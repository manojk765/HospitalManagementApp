"use client"

import { useState, useEffect, Suspense } from "react"
import { Plus, Edit, Trash, Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface Bed {
  id: number
  type: "GeneralWard" | "SemiPrivate" | "Private" | "ICU"
  bedNumber: string
  dailyRate: number
  available: boolean
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

const BedsLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)

const Pagination = ({ page, count }: { page: number; count: number }) => {
  const searchParams = useSearchParams()
  const ITEMS_PER_PAGE = 7
  
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE)
  
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", pageNumber.toString())
    return `?${params.toString()}`
  }
  
  if (totalPages <= 1) return null
  
  return (
    <div className="flex items-center gap-2">
      {page > 1 && (
        <a
          href={createPageURL(page - 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          Previous
        </a>
      )}
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
        <a
          key={pageNumber}
          href={createPageURL(pageNumber)}
          className={`px-3 py-1 border rounded ${
            pageNumber === page ? "bg-blue-500 text-white" : "hover:bg-gray-100"
          }`}
        >
          {pageNumber}
        </a>
      ))}
      
      {page < totalPages && (
        <a
          href={createPageURL(page + 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          Next
        </a>
      )}
    </div>
  )
}

const BedsContent = () => {
  const ITEMS_PER_PAGE = 7
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const currentPage = Number(searchParams.get("page") || "1")

  const [beds, setBeds] = useState<Bed[]>([])
  const [filteredBeds, setFilteredBeds] = useState<Bed[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingBed, setEditingBed] = useState<Bed | null>(null)
  const [deletingBed, setDeletingBed] = useState<Bed | null>(null)
  const [searchTerm, setSearchTerm] = useState(searchQuery)

  const [type, setType] = useState<string>("")
  const [bedNumber, setBedNumber] = useState("")
  const [dailyRate, setDailyRate] = useState("")
  const [available, setAvailable] = useState("true")

  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasRelatedRecords, setHasRelatedRecords] = useState(false)

  useEffect(() => {
    const fetchBeds = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/beds")
        if (!response.ok) throw new Error("Failed to fetch beds")
        const data = await response.json()
        setBeds(data)
      } catch (err) {
        setError("Failed to load beds. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBeds()
  }, [])

  useEffect(() => {
    setSearchTerm(searchQuery)

    if (!searchQuery) {
      setFilteredBeds(beds)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = beds.filter(
      (bed) =>
        bed.bedNumber.toLowerCase().includes(query) ||
        bed.type.toLowerCase().includes(query)
    )

    setFilteredBeds(filtered)
  }, [beds, searchQuery])

  const getPaginatedBeds = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredBeds.slice(startIndex, endIndex)
  }

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

  const clearSearch = () => {
    setSearchTerm("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const bedData = {
        type,
        bedNumber,
        dailyRate: parseFloat(dailyRate),
        available: available === "true"
      }

      let response
      
      if (editingBed) {
        response = await fetch(`/api/beds/${editingBed.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bedData)
        })
      } else {
        response = await fetch("/api/beds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bedData)
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save bed")
      }

      // Refetch beds and reset form
      const bedsResponse = await fetch("/api/beds")
      const data = await bedsResponse.json()
      setBeds(data)
      resetForm()
      setIsDialogOpen(false)
      setSuccessMessage(editingBed ? "Bed updated successfully!" : "Bed created successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${editingBed ? "update" : "create"} bed.`)
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingBed) return
    
    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/beds/${deletingBed.id}`, {
        method: "DELETE"
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete bed")
      }

      // Refetch beds
      const bedsResponse = await fetch("/api/beds")
      const data = await bedsResponse.json()
      setBeds(data)
      setDeletingBed(null)
      setIsDeleteDialogOpen(false)
      setSuccessMessage("Bed deleted successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete bed.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (bed: Bed) => {
    setEditingBed(bed)
    setType(bed.type)
    setBedNumber(bed.bedNumber)
    setDailyRate(bed.dailyRate.toString())
    setAvailable(bed.available.toString())
    setIsDialogOpen(true)
  }

  const handleDelete = async (bed: Bed) => {
    try {
      const response = await fetch(`/api/beds/${bed.id}/check-relations`)
      const data = await response.json()
      
      setDeletingBed(bed)
      setHasRelatedRecords(data.hasRelatedRecords)
      setIsDeleteDialogOpen(true)
    } catch (err) {
      setError("Failed to check bed relationships.")
      console.error(err)
    }
  }

  const resetForm = () => {
    setType("")
    setBedNumber("")
    setDailyRate("")
    setAvailable("true")
    setEditingBed(null)
  }

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Beds Management</h1>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? `Found ${filteredBeds.length} beds matching "${searchQuery}"`
              : `Total ${beds.length} beds available.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
          >
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search beds..."
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
          <button
            onClick={() => {
              resetForm()
              setIsDialogOpen(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Plus className="w-5 h-5" />
            Add Bed
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bed Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Daily Rate (₹)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getPaginatedBeds().length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {searchQuery ? `No beds found matching "${searchQuery}"` : "No beds found"}
                  </td>
                </tr>
              ) : (
                getPaginatedBeds().map((bed) => (
                  <tr key={bed.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{bed.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{bed.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{bed.bedNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{bed.dailyRate.toString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bed.available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {bed.available ? "Available" : "Occupied"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleEdit(bed)}>
                          <Edit className="w-5 h-5 text-blue-500 hover:text-blue-600" />
                        </button>
                        <button onClick={() => handleDelete(bed)}>
                          <Trash className="w-5 h-5 text-red-500 hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredBeds.length)} of {filteredBeds.length} entries
            </div>
            <Pagination page={currentPage} count={filteredBeds.length} />
          </div>
        </div>
      </div>

      {/* Add/Edit Bed Modal */}
      <Modal isOpen={isDialogOpen} onClose={() => {
        resetForm()
        setIsDialogOpen(false)
      }}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800" id="modal-title">
              {editingBed ? `Edit Bed: ${editingBed.bedNumber}` : "Add New Bed"}
            </h2>
            <button
              onClick={() => {
                resetForm()
                setIsDialogOpen(false)
              }}
              className="text-gray-400 hover:text-gray-500 transition-colors"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Room Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Room Type</option>
                <option value="GeneralWard">General Ward</option>
                <option value="SemiPrivate">Semi Private</option>
                <option value="Private">Private</option>
                <option value="ICU">ICU</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="bedNumber" className="block text-sm font-medium text-gray-700">
                Bed Number
              </label>
              <input
                type="text"
                id="bedNumber"
                value={bedNumber}
                onChange={(e) => setBedNumber(e.target.value)}
                required
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dailyRate" className="block text-sm font-medium text-gray-700">
                Daily Rate
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="dailyRate"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="w-full border rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="available" className="block text-sm font-medium text-gray-700">
                Availability Status
              </label>
              <select
                id="available"
                value={available}
                onChange={(e) => setAvailable(e.target.value)}
                required
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Available</option>
                <option value="false">Occupied</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setIsDialogOpen(false)
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
                    Submitting...
                  </span>
                ) : editingBed ? (
                  "Update Bed"
                ) : (
                  "Add Bed"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteDialogOpen} onClose={() => {
        setDeletingBed(null)
        setIsDeleteDialogOpen(false)
      }}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800" id="modal-title">
              Delete Bed
            </h2>
            <button
              onClick={() => {
                setDeletingBed(null)
                setIsDeleteDialogOpen(false)
              }}
              className="text-gray-400 hover:text-gray-500 transition-colors"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {hasRelatedRecords ? (
            <div>
              <p className="text-red-500 mb-4">
                This bed has associated admission records and cannot be deleted.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setDeletingBed(null)
                    setIsDeleteDialogOpen(false)
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-4">
                Are you sure you want to delete bed number {deletingBed?.bedNumber} ({deletingBed?.type})?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setDeletingBed(null)
                    setIsDeleteDialogOpen(false)
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></div>
                      Deleting...
                    </span>
                  ) : (
                    "Confirm Delete"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

// Main component that wraps the Beds content with Suspense
export default function BedsManagementPage() {
  return (
    <Suspense fallback={<BedsLoading />}>
      <BedsContent />
    </Suspense>
  )
}