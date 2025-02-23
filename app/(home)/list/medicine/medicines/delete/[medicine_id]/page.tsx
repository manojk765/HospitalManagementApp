'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

interface Medicine {
  medicine_name: string;
  manufacturer_name : string;
}

type Params = Promise<{ medicine_id : string }> 

export default function DeleteMedicine( props : {params : Params }) {
  const params = use(props.params)
  
  const router = useRouter()
  const [medicine, setMedicine] = useState<Medicine | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchMedicine = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/medicine/${params.medicine_id}`)
        if (response.ok) {
          const data = await response.json()
          setMedicine(data)
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to load medicine data')
        }
      } catch (err) {
        setError(`Failed to fetch medicine data ${err}`)
      }
      setLoading(false)
    }

    if (params.medicine_id) {
      fetchMedicine()
    }
  }, [params.medicine_id])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/medicine/${params.medicine_id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/medicine/medicines')
        router.refresh()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to delete medicine')
      }
    } catch (err) {
      setError(`Failed to delete medicine ${err}`)
    }
    setIsDeleting(false)
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg">Loading...</p>
    </div>
  )

  if (!medicine) return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-red-50 text-red-500 p-4 rounded-md">
        Medicine not found
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Delete Medicine</h1>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-700 font-medium">Warning: This action cannot be undone!</p>
          <p className="text-red-600 mt-2">
            Deleting this medicine will remove it permanently from the database.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Medicine Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Medicine Name</p>
                <p className="mt-1">{medicine.medicine_name}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Manufacturer Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Pharmacy Name</p>
                <p className="mt-1">{medicine.manufacturer_name}</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:bg-red-300"
          >
            {isDeleting ? 'Deleting...' : 'Delete Medicine'}
          </button>
        </div>
      </div>
    </div>
  )
}
