'use client'

import { useState, useEffect , use } from 'react'
import { useRouter } from 'next/navigation'

interface Medicine {
  medicine_name: string;
  strength: string;
  medicine_type: string;
}

interface Manufacturer {
  vendor_pharm_name: string;
  vendor_name: string;
  contact_number: string;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  medicines: Medicine[];
}

type Params = Promise<{ vendor_pharm_name : string }> 

export default function DeleteManufacturer( props: { params: Params } ) {
  const params = use(props.params); 
  
  const router = useRouter()
  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchManufacturer = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/manufacturer/${params.vendor_pharm_name}`)
        if (response.ok) {
          const data = await response.json()
          setManufacturer(data)
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to load manufacturer data')
        }
      } catch (err) {
        setError(`Failed to fetch manufacturer data ${err}`)
      }
      setLoading(false)
    }
    
    if (params.vendor_pharm_name) {
      fetchManufacturer()
    }
  }, [params.vendor_pharm_name])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this manufacturer? This will also delete all associated medicines.')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/manufacturer/${params.vendor_pharm_name}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/medicine/manufacturers')
        router.refresh()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to delete manufacturer')
      }
    } catch (err) {
      setError(`Failed to delete manufacturer: ${err}`)
    }
    setIsDeleting(false)
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg">Loading...</p>
    </div>
  )

  if (!manufacturer) return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-red-50 text-red-500 p-4 rounded-md">
        Manufacturer not found
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Delete Manufacturer</h1>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-700 font-medium">Warning: This action cannot be undone!</p>
          <p className="text-red-600 mt-2">
            Deleting this manufacturer will also remove all associated medicines from the database.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Manufacturer Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Pharmacy Name</p>
                <p className="mt-1">{manufacturer.vendor_pharm_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Vendor Name</p>
                <p className="mt-1">{manufacturer.vendor_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Contact Number</p>
                <p className="mt-1">{manufacturer.contact_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1">{manufacturer.email || '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="mt-1">
                  {[
                    manufacturer.address,
                    manufacturer.city,
                    manufacturer.state,
                    manufacturer.zip_code
                  ].filter(Boolean).join(', ') || '-'}
                </p>
              </div>
            </div>
          </div>

          {manufacturer.medicines && manufacturer.medicines.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Associated Medicines</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-2">
                  The following medicines will also be deleted:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  {manufacturer.medicines.map((medicine) => (
                    <li key={medicine.medicine_name} className="text-sm">
                      {medicine.medicine_name} ({medicine.strength}) - {medicine.medicine_type}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
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
            {isDeleting ? 'Deleting...' : 'Delete Manufacturer'}
          </button>
        </div>
      </div>
    </div>
  )
}