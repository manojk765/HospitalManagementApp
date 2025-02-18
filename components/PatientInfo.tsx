import type { Doctor, Patient } from "@prisma/client" 
import Link from "next/link"

export default function PatientInfo({ patient , doctor }: { patient: Patient , doctor: Doctor | null}) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Patient Information</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Name:</p> 
          <p>{patient.name}</p>
        </div>
        <div>
          <p className="font-semibold">ID:</p>
          <p>{patient.patient_id}</p>
        </div>
        <div>
          <p className="font-semibold">Gender:</p>
          <p>{patient.gender}</p>
        </div>
        <div>
          <p className="font-semibold">Age:</p>
          <p>{patient.age}</p>
        </div>
        <div>
          <p className="font-semibold">Date of Birth:</p>
          <p>{new Date(patient.date_of_birth).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="font-semibold">Contact:</p>
          <p>{patient.contact_number}</p>
        </div>
        <div>
          <p className="font-semibold">Email:</p>
          <p>{patient.email || "N/A"}</p>
        </div>
        <div>
          <p className="font-semibold">Category:</p>
          <p>{patient.category}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="font-semibold">Address:</p>
        <p>{`${patient.address || ""}, ${patient.city || ""}, ${patient.state || ""} ${patient.zip_code || ""}`}</p>
      </div>


      {
        doctor ?  (
          <div className="mt-4">

            <p className="font-semibold">Doctor details:</p>
            <p>{doctor.doctor_id}</p>

            <p>{doctor.name}</p>

            <p>{doctor.contact_number}</p>

            <p>{doctor.email || "N/A"}</p>
          
           <p>{doctor.specialty}</p>

          </div>
        ) : (
          <div className="mt-4">
            <p className="font-semibold">Doctor:</p>
            <p>Not Assigned</p>
          </div>
        )
      }
      
    </div>
  )
}

