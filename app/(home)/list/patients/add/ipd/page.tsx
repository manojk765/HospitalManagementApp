'use client'

import { useState , useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AddPatientForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male', 
    date_of_birth: '',
    age: '',
    contact_number: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    category: 'Gynecology',
    doctor_id : '' ,
  })

  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [newPatientId, setNewPatientId] = useState('')
  const [doctors, setDoctors] = useState<{ doctor_id: string, name: string }[]>([])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          gender: formData.gender,
          date_of_birth: formData.date_of_birth,
          age: formData.age,
          contact_number: formData.contact_number,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          category: formData.category,
          doctor_id: formData.doctor_id 
        }),
      })
      
      const data = await response.json()

      if (response.ok) {
        setNewPatientId(data.patient_id)
        setSuccessMessage('Patient added successfully! Patient ID: ' + data.patient_id)

        // Reset form
        setFormData({
          name: '',
          gender: 'Male',
          date_of_birth: '',
          age: '',
          contact_number: '',
          email: '',
          address: '',
          city: '',
          state: '',
          zip_code: '',
          category: 'Gynecology',
          doctor_id:'',
        })

        setTimeout(() => {
          router.push('/list/patients/list')
        }, 5000)
      } else {
        setError(data.error || 'Failed to add patient')
      }
    } catch (error) {
      setError('An error occurred while adding the patient. Please try again.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form Fields */}
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Date of Birth</label>
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Age</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
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

      <div>
        <label className="block text-sm font-medium">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        >
          <option value="Gynecology">Gynecology</option>
          <option value="IVF">IVF</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Doctor</label>
        <select
          name="doctor_id"
          value={formData.doctor_id}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.doctor_id} value={doctor.doctor_id}>
              {doctor.name} (ID: {doctor.doctor_id})
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Add Patient
      </button>
    </form>
  )
}
