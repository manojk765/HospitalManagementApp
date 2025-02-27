"use client"

import Decimal from 'decimal.js'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const formData = new FormData(event.currentTarget)
      await onSubmit(formData)
      router.push('/list/services/list')
    } catch (err) {
      console.error('Error submitting form:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">{initialData ? 'Edit Service' : 'Create New Service'}</h1>
      
      {error && (
        <div className="mb-4 p-4 border border-red-400 rounded-md bg-red-50 text-red-700">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">

        {initialData?.service_name && (
          <input
            type="hidden"
            name="service_name"
            value={initialData.service_name}
          />
        )}
        
        <div>
          <label htmlFor="service_name_display" className="block text-sm font-medium text-gray-700 mb-2">
            Service Name
          </label>
          <input
            type="text"
            id="service_name_display" 
            required={!initialData}
            defaultValue={initialData?.service_name || ''}
            disabled={!!initialData?.service_name}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ease-in-out duration-200 disabled:bg-gray-100"
          />
          {!initialData && (
            <input
              type="text"
              name="service_name"
              required
              defaultValue=""
              className="hidden" // Will be shown only in create mode
            />
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            required
            defaultValue={initialData?.description || ''}
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
            defaultValue={initialData?.cost ? Number(initialData.cost) : ''}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ease-in-out duration-200"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-200"
          >
            Cancel
          </button>
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