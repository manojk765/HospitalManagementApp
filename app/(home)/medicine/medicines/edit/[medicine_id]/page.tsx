'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EditMedicine({ params }: { params: { medicine_id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    medicine_name: '',
    stock_quantity: 0,
    price_per_unit: 0,
    unit_quantity: 0,
    batch_number: '',
    expiry_date: '',
    manufacturer_name: '',
  })
  const [manufacturers, setManufacturers] = useState([]) // To store all manufacturers
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch all manufacturers on component mount
  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await fetch('/api/manufacturer')
        const data = await response.json()
        setManufacturers(data)
      } catch (error) {
        console.error('Failed to fetch manufacturers:', error)
      }
    }

    fetchManufacturers()
  }, [])

  // Fetch medicine data when medicine_id is available
  useEffect(() => {
    const fetchMedicine = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/medicine/${params.medicine_id}`)
        if (response.ok) {
          const data = await response.json()
          setFormData(data)
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to load medicine data')
        }
      } catch (err) {
        setError('Failed to fetch medicine data')
      }
      setLoading(false)
    }

    if (params.medicine_id) {
      fetchMedicine()
    }
  }, [params.medicine_id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch(`/api/medicine/${params.medicine_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        router.push('/medicine/medicines')
        router.refresh()
      } else {
        setError(result.error || 'Failed to update medicine')
      }
    } catch (err) {
      setError('Failed to update medicine')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Medicine</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Medicine Name */}
        <div>
          <label className="block text-sm font-medium">Medicine Name</label>
          <input
            type="text"
            name="medicine_name"
            value={formData.medicine_name}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
            required
          />
        </div>

        {/* Stock Quantity */}
        <div>
          <label className="block text-sm font-medium">Stock Quantity</label>
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
            required
          />
        </div>

        {/* Price Per Unit */}
        <div>
          <label className="block text-sm font-medium">Price Per Unit</label>
          <input
            type="number"
            step="0.01"
            name="price_per_unit"
            value={formData.price_per_unit}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
            required
          />
        </div>

        {/* Unit Quantity */}
        <div>
          <label className="block text-sm font-medium">Unit Quantity</label>
          <input
            type="number"
            step="0.01"
            name="unit_quantity"
            value={formData.unit_quantity}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
            required
          />
        </div>

        {/* Batch Number */}
        <div>
          <label className="block text-sm font-medium">Batch Number</label>
          <input
            type="text"
            name="batch_number"
            value={formData.batch_number}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
            required
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium">Expiry Date</label>
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date.split('T')[0]} // Formatting the date correctly
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
            required
          />
        </div>

        {/* Manufacturer Name */}
        <div>
          <label className="block text-sm font-medium">Manufacturer Name</label>
          <select
            name="manufacturer_name"
            value={formData.manufacturer_name}
            onChange={handleChange}
            className="border p-2 w-full rounded-md"
            required
          >
            {/* Display current manufacturer as default */}
            <option value={formData.manufacturer_name}>
              {formData.manufacturer_name}
            </option>

            {/* List other manufacturers as suggestions */}
            {manufacturers
              .filter((manufacturer: any) => manufacturer.vendor_pharm_name !== formData.manufacturer_name)
              .map((manufacturer: any) => (
                <option key={manufacturer.vendor_pharm_name} value={manufacturer.vendor_pharm_name}>
                  {manufacturer.vendor_pharm_name}
                </option>
              ))}
          </select>
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
            Update Medicine
          </button>
        </div>
      </form>
    </div>
  )
}
