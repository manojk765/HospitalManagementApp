"use client"

import { useState } from "react"

export default function AddAppointmentPage() {
  const [appointment, setAppointment] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
    appointment_status: "Scheduled",
    reason: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setAppointment((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(appointment)
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Appointment</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label htmlFor="patient_id" className="block text-lg font-medium text-gray-700">
            Patient ID
          </label>
          <input
            type="text"
            name="patient_id"
            id="patient_id"
            value={appointment.patient_id}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="doctor_id" className="block text-lg font-medium text-gray-700">
            Doctor ID
          </label>
          <input
            type="text"
            name="doctor_id"
            id="doctor_id"
            value={appointment.doctor_id}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="appointment_date" className="block text-lg font-medium text-gray-700">
            Appointment Date
          </label>
          <input
            type="date"
            name="appointment_date"
            id="appointment_date"
            value={appointment.appointment_date}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="appointment_time" className="block text-lg font-medium text-gray-700">
            Appointment Time
          </label>
          <input
            type="time"
            name="appointment_time"
            id="appointment_time"
            value={appointment.appointment_time}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="appointment_status" className="block text-lg font-medium text-gray-700">
            Appointment Status
          </label>
          <select
            name="appointment_status"
            id="appointment_status"
            value={appointment.appointment_status}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="reason" className="block text-lg font-medium text-gray-700">
            Reason
          </label>
          <textarea
            name="reason"
            id="reason"
            value={appointment.reason}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            Add Appointment
          </button>
        </div>
      </form>
    </div>
  )
}
