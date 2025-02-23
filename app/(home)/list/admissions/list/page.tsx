"use client"

import { useEffect, useState } from "react"

interface Patient {
  patient_id: string
  name: string
  email: string
}

interface Room {
  id: string
  type: string
  bedNumber: string
  dailyRate: number
  available: boolean
}

interface Admission {
  patient_id: string
  room_id: string
  admittedDate: string
  dischargeDate: string
}

export default function AdmissionList() {
  const [admissions, setAdmissions] = useState<Admission[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [rooms, setRooms] = useState<Room[]>([]) 
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError('')

        const [patientsResponse, roomsResponse, admissionsResponse] = await Promise.all([
          fetch("/api/patient"),
          fetch("/api/rooms"),
          fetch("/api/admissions"),
        ])

        if (!patientsResponse.ok || !roomsResponse.ok || !admissionsResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const patientsData = await patientsResponse.json()
        const roomsData = await roomsResponse.json()
        const admissionsData = await admissionsResponse.json()

        const formattedPatientsData = patientsData.map((patient: Patient) => ({
          patient_id : patient.patient_id,
          name: patient.name,
          email: patient.email,
        }))

        const formattedRoomsData = roomsData.map((room: any) => ({
          id: room.id,
          type: room.type,
          bedNumber: room.bedNumber,
          dailyRate: room.dailyRate,
          available: room.available,
        }))

        const formattedAdmissionsData = admissionsData.map((admission: any) => ({
          patient_id: admission.patient_id,
          room_id: admission.room_id,
          admittedDate: admission.admittedDate,
          dischargeDate: admission.dischargeDate
        }))

        setPatients(formattedPatientsData)
        setRooms(formattedRoomsData)
        setAdmissions(formattedAdmissionsData)
      } catch (err) {
        setError("Failed to load data. Please try again.")
        console.error("Error fetching data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDateReset = () => {
    setSelectedDate('')
  }

  const filteredAndSortedAdmissions = admissions
    .filter((admission) => admission.dischargeDate !== null)
    .filter((admission) => {
      if (!selectedDate) return true
      const dischargeDateStr = new Date(admission.dischargeDate).toISOString().split('T')[0]
      return dischargeDateStr === selectedDate
    })
    .sort((a, b) => 
      new Date(b.dischargeDate).getTime() - new Date(a.dischargeDate).getTime()
    )

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Discharges</h2>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="date-select" className="font-medium">
              Filter by Date:
            </label>
            <input
              type="date"
              id="date-select"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {selectedDate && (
            <button
              onClick={handleDateReset}
              className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Show All
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-gray-100 border-b">Patient</th>
                <th className="px-4 py-2 bg-gray-100 border-b">Room</th>
                <th className="px-4 py-2 bg-gray-100 border-b">Admitted Date</th>
                <th className="px-4 py-2 bg-gray-100 border-b">Discharged Date</th>
                <th className="px-4 py-2 bg-gray-100 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedAdmissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    {selectedDate 
                      ? "No discharges found for this date" 
                      : "No discharge records available"
                    }
                  </td>
                </tr>
              ) : (
                filteredAndSortedAdmissions.map((admission) => {
                  const patient = patients.find((p) => p.patient_id === admission.patient_id)
                  const room = rooms.find((r) => r.id === admission.room_id)
                  return (
                    <tr key={`${admission.patient_id}-${admission.admittedDate}`}>
                      <td className="px-4 py-2 border-b">{patient ? patient.name : "Unknown"}</td>
                      <td className="px-4 py-2 border-b">
                        {room ? `${room.type} - ${room.bedNumber}` : "Unknown"}
                      </td>
                      <td className="px-4 py-2 border-b">{formatDate(admission.admittedDate)}</td>
                      <td className="px-4 py-2 border-b">
                        {admission.dischargeDate ? formatDate(admission.dischargeDate) : "Not Assigned"}
                      </td>
                      <td className="px-4 py-2 border-b">
                        <span className="text-gray-500">Discharged</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}