"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { Plus, Edit2, Trash2, Search, X } from "lucide-react"
import { createService, updateService, deleteService } from "./service-actions"
import { useRouter, useSearchParams } from "next/navigation"
import Pagination from "@/components/pagination"

interface Service {
  service_name: string
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

// Loading component for Suspense
const ServicesLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)

// Client component that uses useSearchParams
const ServicesContent = () => {
  const ITEMS_PER_PAGE = 10
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const currentPage = Number(searchParams.get("page") || "1")

  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [searchTerm, setSearchTerm] = useState(searchQuery)

  const [serviceName, setServiceName] = useState("")
  const [description, setDescription] = useState("")
  const [cost, setCost] = useState("")

  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/services`)
        if (!response.ok) throw new Error("Failed to fetch services")
        const data = await response.json()
        setServices(data)
      } catch (err) {
        setError("Failed to load services. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [])

  useEffect(() => {
    setSearchTerm(searchQuery)

    if (!searchQuery) {
      setFilteredServices(services)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = services.filter(
      (service) =>
        service.service_name.toLowerCase().includes(query) || service.description.toLowerCase().includes(query),
    )

    setFilteredServices(filtered)
  }, [services, searchQuery])

  const getPaginatedServices = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredServices.slice(startIndex, endIndex)
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
      formData.append("service_name", editingService ? editingService.service_name : serviceName)
      formData.append("description", description)
      formData.append("cost", cost)

      if (editingService) {
        await updateService(formData)
        setSuccessMessage("Service updated successfully!")
      } else {
        await createService(formData)
        setSuccessMessage("Service created successfully!")
      }

      // Refetch services and reset form
      const response = await fetch(`/api/services`)
      const data = await response.json()
      setServices(data)
      resetForm()
      setIsDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${editingService ? "update" : "create"} service.`)
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (serviceName: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    try {
      const formData = new FormData()
      formData.append("service_name", serviceName)

      await deleteService(formData)

      setSuccessMessage("Service deleted successfully!")

      const response = await fetch(`/api/services`)
      const data = await response.json()
      setServices(data)
    } catch (err) {
      setError("Failed to delete service. Please try again.")
      console.error(err)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setServiceName(service.service_name)
    setDescription(service.description)
    setCost(service.cost.toString())
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setServiceName("")
    setDescription("")
    setCost("")
    setEditingService(null)
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
          <h1 className="text-3xl font-bold text-gray-800">Hospital Services</h1>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? `Found ${filteredServices.length} services matching "${searchQuery}"`
              : `You have ${services.length} services available`}
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
              placeholder="Search services..."
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

          {/* Add New Service Button */}
          <button
            onClick={() => {
              resetForm()
              setIsDialogOpen(true)
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Service
          </button>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left text-sm font-medium text-gray-700">Service Name</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Description</th>
              <th className="p-3 text-right text-sm font-medium text-gray-700">Cost</th>
              <th className="p-3 text-center text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getPaginatedServices().length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  {searchQuery ? `No services found matching "${searchQuery}"` : "No services found"}
                </td>
              </tr>
            ) : (
              getPaginatedServices().map((service) => (
                <tr key={service.service_name} className="border-b hover:bg-gray-50 transition duration-200">
                  <td className="p-3 text-sm text-gray-700">{service.service_name}</td>
                  <td className="p-3 text-sm text-gray-700">{service.description}</td>
                  <td className="p-3 text-sm text-right text-gray-700">₹{service.cost.toString()}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded transition duration-200"
                      title="Edit service"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.service_name)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded transition duration-200"
                      title="Delete service"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredServices.length > 0 && <Pagination page={currentPage} count={filteredServices.length} />}

      <Modal
        isOpen={isDialogOpen}
        onClose={() => {
          resetForm()
          setIsDialogOpen(false)
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800" id="modal-title">
              {editingService ? "Edit Service: " + editingService.service_name : "Add New Service"}
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
            {!editingService && (
              <div className="space-y-2">
                <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">
                  Service Name
                </label>
                <input
                  type="text"
                  id="serviceName"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  required
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
                Cost
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="cost"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="w-full border rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
                ) : editingService ? (
                  "Update Service"
                ) : (
                  "Add Service"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}

// Main component that wraps the Services content with Suspense
export default function ServicesManagementPage() {
  return (
    <Suspense fallback={<ServicesLoading />}>
      <ServicesContent />
    </Suspense>
  )
}