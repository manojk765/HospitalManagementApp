import type React from "react"

interface Patient {
  patient_id: string
  name: string
}

interface Props {
  patients: Patient[]
  selectedPatient: string | null
  onSelectPatient: (patientId: string) => void
}

const PatientSelector: React.FC<Props> = ({ patients, selectedPatient, onSelectPatient }) => {
  return (
    <div className="mb-6">
      <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-2">
        Select Patient
      </label>
      <select
        id="patient"
        value={selectedPatient || ""}
        onChange={(e) => onSelectPatient(e.target.value)}
        className="block w-full p-2 border rounded"
      >
        <option value="">-- Select a Patient --</option>
        {patients.map((patient) => (
          <option key={patient.patient_id} value={patient.patient_id}>
            {patient.name} ({patient.patient_id})
          </option>
        ))}
      </select>
    </div>
  )
}

export default PatientSelector

