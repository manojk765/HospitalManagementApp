"use client"

import Decimal from 'decimal.js'
import { useState } from 'react'

interface ServiceFormProps {
  initialData?: {
    service_name: string
    description: string
    cost: Decimal
  }
  onSubmit: (formData: FormData) => Promise<void>
}

export default function ServiceForm({ initialData, onSubmit }: ServiceFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    await onSubmit(formData)
    setIsLoading(false)
    window.location.href = '/list/services/list'
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create New Service</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="service_name" className="block text-sm font-medium text-gray-700 mb-2">
            Service Name
          </label>
          <input
            type="text"
            name="service_name"
            id="service_name"
            required
            defaultValue={initialData?.service_name}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ease-in-out duration-200"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            required
            defaultValue={initialData?.description}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ease-in-out duration-200"
          />
        </div>
        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-2">
            Cost
          </label>
          <input
            type="number"
            name="cost"
            id="cost"
            step="0.01"
            required
            defaultValue={Number(initialData?.cost)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ease-in-out duration-200"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
