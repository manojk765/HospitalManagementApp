"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { ChangeEvent } from "react"

interface Doctor {
  doctor_id: string
  name: string
  specialty: string
  contact_number: string
  email: string
  experience_years: number
  department_name: string
  department: {
    department_name: string
  }
}

interface Department {
  department_name: string
}

interface DoctorFormProps {
  doctor?: Doctor
  isEdit?: boolean
}

const DoctorForm: React.FC<DoctorFormProps> = ({ doctor, isEdit = false }) => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await fetch("/api/departments")
      const data = await response.json()
      setDepartments(data)
    }
    fetchDepartments()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = e.currentTarget
    const formData = {
      doctor_id: (form.elements.namedItem("doctor_id") as HTMLInputElement).value,
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      specialty: (form.elements.namedItem("specialty") as HTMLInputElement).value,
      contact_number: (form.elements.namedItem("contact_number") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      experience_years: Number.parseInt((form.elements.namedItem("experience_years") as HTMLInputElement).value),
      department_name: (form.elements.namedItem("department_name") as HTMLSelectElement).value,
    }

    try {
      const url = isEdit ? `/api/doctors/${doctor?.doctor_id}` : "/api/doctors"
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

      window.location.href = "/list/staff/doctor-list"
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const [selectedDepartment, setSelectedDepartment] = useState(doctor?.department_name || "")

  useEffect(() => {
    if (doctor?.department_name) {
      setSelectedDepartment(doctor.department_name)
    }
  }, [doctor?.department_name])

  const handleDepartmentChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    setSelectedDepartment(selectedValue)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Doctor" : "Add New Doctor"}</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`${isEdit ? "" : "hidden"}`}>
          <label className="block text-sm font-medium mb-2">Doctor ID</label>
          <input
            type="text"
            name="doctor_id"
            defaultValue={doctor?.doctor_id || "DXXX"}
            required
            disabled={isEdit}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input type="text" name="name" defaultValue={doctor?.name} required className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Specialty</label>
          <input
            type="text"
            name="specialty"
            defaultValue={doctor?.specialty}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Contact Number</label>
          <input
            type="tel"
            name="contact_number"
            defaultValue={doctor?.contact_number}
            pattern="[0-9]{10}"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={doctor?.email}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Experience (Years)</label>
          <input
            type="number"
            name="experience_years"
            defaultValue={doctor?.experience_years}
            required
            min="0"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Department</label>
          <select
            name="department_name"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.department_name} value={dept.department_name}>
                {dept.department_name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? "Processing..." : isEdit ? "Update Doctor" : "Add Doctor"}
        </button>
      </form>
    </div>
  )
}

export default DoctorForm

