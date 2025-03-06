"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Search, X } from "lucide-react"
import { createSurgery, updateSurgery, deleteSurgery } from "./server-actions"
import { useRouter, useSearchParams } from "next/navigation"
import Pagination from "@/components/pagination"

interface Surgery {
  surgery_name: string
  description: string
  cost: number
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

const ITEMS_PER_PAGE = 10

export default function SurgeryManagementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const currentPage = Number(searchParams.get("page") || "1")

  const [surgeries, setSurgeries] = useState<Surgery[]>([])
  const [filteredSurgeries, setFilteredSurgeries] = useState<Surgery[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSurgery, setEditingSurgery] = useState<Surgery | null>(null)
  const [searchTerm, setSearchTerm] = useState(searchQuery)

  const [surgeryName, setSurgeryName] = useState("")
  const [description, setDescription] = useState("")
  const [cost, setCost] = useState("")

  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchSurgeries = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/surgery`)
        if (!response.ok) throw new Error("Failed to fetch surgeries")
        const data = await response.json()
        setSurgeries(data)
      } catch (err) {
        setError("Failed to load surgeries. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSurgeries()
  }, [])

  useEffect(() => {
    setSearchTerm(searchQuery)

    if (!searchQuery) {
      setFilteredSurgeries(surgeries)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = surgeries.filter(
      (surgery) =>
        surgery.surgery_name.toLowerCase().includes(query) || surgery.description.toLowerCase().includes(query),
    )

    setFilteredSurgeries(filtered)
  }, [surgeries, searchQuery])

  const getPaginatedSurgeries = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredSurgeries.slice(startIndex, endIndex)
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
      const formData = new FormData()
      formData.append("surgery_name", editingSurgery ? editingSurgery.surgery_name : surgeryName)
      formData.append("description", description)
      formData.append("cost", cost)

      if (editingSurgery) {
        await updateSurgery(formData)
        setSuccessMessage("Surgery updated successfully!")
      } else {
        await createSurgery(formData)
        setSuccessMessage("Surgery created successfully!")
      }

      const response = await fetch(`/api/surgery`)
      const data = await response.json()
      setSurgeries(data)
      resetForm()
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${editingSurgery ? "update" : "create"} surgery.`)
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (surgeryName: string) => {
    if (!confirm("Are you sure you want to delete this surgery?")) return

    try {
      const formData = new FormData()
      formData.append("surgery_name", surgeryName)

      await deleteSurgery(formData)

      setSuccessMessage("Surgery deleted successfully!")

      const response = await fetch(`/api/surgery`)
      const data = await response.json()
      setSurgeries(data)
    } catch (err) {
      setError("Failed to delete surgery. Please try again.")
      console.error(err)
    }
  }

  const handleEdit = (surgery: Surgery) => {
    setEditingSurgery(surgery)
    setSurgeryName(surgery.surgery_name)
    setDescription(surgery.description)
    setCost(surgery.cost.toString())
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setSurgeryName("")
    setDescription("")
    setCost("")
    setEditingSurgery(null)
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
          <h1 className="text-3xl font-bold text-gray-800">Surgical Procedures</h1>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? `Found ${filteredSurgeries.length} surgeries matching "${searchQuery}"`
              : `You have ${surgeries.length} surgical procedures available`}
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
              placeholder="Search surgeries..."
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

          {/* Add New Surgery Button */}
          <button
            onClick={() => {
              resetForm()
              setIsDialogOpen(true)
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Surgery
          </button>
        </div>
      </div>

      {/* Surgeries Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left text-sm font-medium text-gray-700">Surgery Name</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Description</th>
              <th className="p-3 text-right text-sm font-medium text-gray-700">Cost</th>
              <th className="p-3 text-center text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getPaginatedSurgeries().length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  {searchQuery ? `No surgeries found matching "${searchQuery}"` : "No surgeries found"}
                </td>
              </tr>
            ) : (
              getPaginatedSurgeries().map((surgery) => (
                <tr key={surgery.surgery_name} className="border-b hover:bg-gray-50 transition duration-200">
                  <td className="p-3 text-sm text-gray-700">{surgery.surgery_name}</td>
                  <td className="p-3 text-sm text-gray-700">{surgery.description}</td>
                  <td className="p-3 text-sm text-right text-gray-700">₹{surgery.cost.toString()}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(surgery)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                      aria-label="Edit surgery"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(surgery.surgery_name)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Delete surgery"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredSurgeries.length > ITEMS_PER_PAGE && (
        <div className="mt-6">
          <Pagination
            page={currentPage}
            count={filteredSurgeries.length}
          />
        </div>
      )}

      {/* Add/Edit Surgery Modal */}
      <Modal isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {editingSurgery ? "Edit Surgery" : "Add New Surgery"}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="surgeryName" className="block text-sm font-medium text-gray-700 mb-1">
                Surgery Name
              </label>
              <input
                type="text"
                id="surgeryName"
                value={surgeryName}
                onChange={(e) => setSurgeryName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter surgery name"
                disabled={!!editingSurgery}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter surgery description"
                rows={3}
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                Cost (₹)
              </label>
              <input
                type="number"
                id="cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter cost"
                min="0"
                step="1"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : editingSurgery ? "Update Surgery" : "Add Surgery"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}