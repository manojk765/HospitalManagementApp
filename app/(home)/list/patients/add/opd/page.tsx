'use client'

import { useState, useEffect } from 'react'

export default function PatientForm() {
  const [doctors, setDoctors] = useState<{ doctor_id: string, name: string }[]>([])
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    visitdate: new Date().toISOString().split('T')[0], // Default to today
    doctor_id: '',
    purpose: '',
    amount: '',
  })
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    // Fetch doctors from the API
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors')
        const data = await response.json()
        setDoctors(data)
      } catch (error) {
        setError('Failed to load doctors')
      }
    }
    fetchDoctors()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/opd-patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setSuccessMessage('Patient record created successfully')
        setFormData({
          name: '',
          contact: '',
          visitdate: new Date().toISOString().split('T')[0],
          doctor_id: '',
          purpose: '',
          amount: '',
        })
      } else {
        const data = await response.json()
        setError(data.error || 'Error creating patient record')
      }
    } catch (error) {
      setError('An error occurred while creating the patient record')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <div>
        <label htmlFor="name" className="block mb-2">
          Patient Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="contact" className="block mb-2">
          Mobile Number:
        </label>
        <input
          type="tel"
          id="contact"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="visitdate" className="block mb-2">
          Visit Date:
        </label>
        <input
          type="date"
          id="visitdate"
          name="visitdate"
          value={formData.visitdate}
          onChange={handleChange}
          disabled
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="doctor_id" className="block mb-2">
          Doctor Assigned:
        </label>
        <select
          id="doctor_id"
          name="doctor_id"
          value={formData.doctor_id}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.doctor_id} value={doctor.doctor_id}>
              {doctor.name} (ID: {doctor.doctor_id})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="purpose" className="block mb-2">
          Purpose of Visit:
        </label>
        <input
          type="text"
          id="purpose"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block mb-2">
          Amount Paid:
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  )
}
