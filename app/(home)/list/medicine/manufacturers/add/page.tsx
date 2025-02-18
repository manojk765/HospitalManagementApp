'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddManufacturer() {
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

  const [error, setError] = useState('') // To store error messages
  const [successMessage, setSuccessMessage] = useState('') // To store success message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')  // Reset error message
    setSuccessMessage('')  // Reset success message

    try {
      const response = await fetch('/api/manufacturer', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });    

      const result = await response.json()

      if (response.ok) {
        // Show success message briefly before redirect
        setSuccessMessage('Manufacturer added successfully!')
        setTimeout(() => {
          router.push('/medicine/manufacturers') // Redirect after success
        }, 2000) // 2-second delay before redirection

      } else {
        setError(result.error || 'Failed to add manufacturer') // Display error message
      }
    } catch (error) {
      setError('An error occurred while adding the manufacturer. Please try again.') // Handle fetch error
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form Fields */}
      <div>
        <label className="block text-sm font-medium">Pharmacy Name</label>
        <input
          type="text"
          name="vendor_pharm_name"
          value={formData.vendor_pharm_name}
          onChange={handleChange}
          placeholder="Pharmacy Name"
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Vendor Name</label>
        <input
          type="text"
          name="vendor_name"
          value={formData.vendor_name}
          onChange={handleChange}
          placeholder="Vendor Name"
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Contact Number</label>
        <input
          type="tel"
          name="contact_number"
          value={formData.contact_number}
          onChange={handleChange}
          placeholder="Contact Number"
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">State</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State"
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">ZIP Code</label>
        <input
          type="text"
          name="zip_code"
          value={formData.zip_code}
          onChange={handleChange}
          placeholder="ZIP Code"
          className="border p-2 w-full"
        />
      </div>

      {/* Display error message if any */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display success message */}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Add Manufacturer
      </button>
    </form>
  )
}
