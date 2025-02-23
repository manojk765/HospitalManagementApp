"use client"

import Decimal from "decimal.js"
import type React from "react"
import { useState } from "react"

interface Bed {
  id: number
  type: "GeneralWard" | "SemiPrivate" | "Private" | "ICU"
  bedNumber: string
  dailyRate: Decimal
  available: boolean
}

interface BedFormProps {
  bed?: Bed
  isEdit?: boolean
}

const BedForm: React.FC<BedFormProps> = ({ bed, isEdit = false }) => {
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = e.currentTarget
    const formData = {
      type: (form.elements.namedItem("type") as HTMLSelectElement).value,
      bedNumber: (form.elements.namedItem("bedNumber") as HTMLInputElement).value,
      dailyRate: Number.parseFloat((form.elements.namedItem("dailyRate") as HTMLInputElement).value),
      available: (form.elements.namedItem("available") as HTMLSelectElement).value === "true",
    }

    try {
      const url = isEdit ? `/api/beds/${bed?.id}` : "/api/beds"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      window.location.href = "/list/beds/list"
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Bed" : "Add New Bed"}</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Room Type</label>
          <select name="type" defaultValue={bed?.type} required className="w-full p-2 border rounded">
            <option value="">Select Room Type</option>
            <option value="GeneralWard">General Ward</option>
            <option value="SemiPrivate">Semi Private</option>
            <option value="Private">Private</option>
            <option value="ICU">ICU</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bed Number</label>
          <input
            type="text"
            name="bedNumber"
            defaultValue={bed?.bedNumber}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Daily Rate (₹)</label>
          <input
            type="number"
            name="dailyRate"
            defaultValue={bed? Number(bed.dailyRate) : ''}
            required
            min="0"
            step="0.01"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Availability Status</label>
          <select name="available" defaultValue={bed?.available?.toString()} required className="w-full p-2 border rounded">
            <option value="true">Available</option>
            <option value="false">Occupied</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? "Processing..." : isEdit ? "Update Bed" : "Add Bed"}
        </button>
      </form>
    </div>
  )
}

export default BedForm