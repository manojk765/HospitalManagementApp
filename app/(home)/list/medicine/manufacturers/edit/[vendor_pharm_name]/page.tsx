'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

type Params = Promise<{ vendor_pharm_name : string }> 

export default function EditManufacturer( props: { params: Params } ) {
  const params = use( props.params )
  
  const router = useRouter()
  const [formData, setFormData] = useState({
    vendor_pharm_name: '',
    vendor_name: '',
    contact_number: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
  })
 
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchManufacturer = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/manufacturer/${params.vendor_pharm_name}`)
        if (response.ok) {
          const data = await response.json()
          setFormData(data)
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

  //update the handleSubmit function:

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch(`/api/manufacturer/${params.vendor_pharm_name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vendor_name: formData.vendor_name,
          contact_number: formData.contact_number,
          email: formData.email || null,
          address: formData.address || null,
          city: formData.city || null,
          state: formData.state || null,
          zip_code: formData.zip_code || null,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        router.push('/medicine/manufacturers')
        router.refresh()
      } else {
        setError(result.error || 'Failed to update manufacturer')
      }
    } catch (err) {
      setError(`Failed to update manufacturer ${err}`)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg">Loading...</p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Manufacturer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pharmacy Name - readonly since it's the primary key */}
        <div>
          <label className="block text-sm font-medium">Pharmacy Name</label>
          <input
            type="text"
            name="vendor_pharm_name"
            value={formData.vendor_pharm_name}
            className="border p-2 w-full bg-gray-100"
            readOnly
          />
        </div>

        {/* Vendor Name */}
        <div>
          <label className="block text-sm font-medium">Vendor Name</label>
          <input
            type="text"
            name="vendor_name"
            value={formData.vendor_name}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
            required
          />
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-sm font-medium">Contact Number</label>
          <input
            type="tel"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            pattern="[0-9]{10}"
            maxLength={10}
            className="border p-2 w-full rounded-md"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            type="text"
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium">State</label>
          <input
            type="text"
            name="state"
            value={formData.state || ''}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
          />
        </div>

        {/* ZIP Code */}
        <div>
          <label className="block text-sm font-medium">ZIP Code</label>
          <input
            type="text"
            name="zip_code"
            value={formData.zip_code || ''}
            onChange={handleChange}
            pattern="[0-9]{5,10}"
            maxLength={10}
            className="border p-2 w-full rounded-md"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md">
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
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Update Manufacturer
          </button>
        </div>
      </form>
    </div>
  )
}