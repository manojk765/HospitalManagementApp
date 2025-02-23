import prisma from "@/lib/prisma"
import AdmissionsPage from "./AdmissionBill"

async function getPatientData(id: string) {
  const patient = await prisma.patient.findUnique({
    where: { patient_id: id }
  })
  return patient
}

async function getPatientAdmissions(patientId: string) {
  const admissions = await prisma.patientAdmissionFee.findMany({
    where: { 
      patient_id: patientId,
      is_paid: false 
    },
    orderBy: { admittedDate: "desc" }
  })
  return admissions
}

export default async function PatientAdmissionsPage({ params }: { params: { id: string } }) {
  const patientId = params.id
  const patient = await getPatientData(patientId)
  const admissions = await getPatientAdmissions(patientId)

  if (!patient) {
    return (
      <div className="p-6 bg-white">
        <p className="text-red-500">Patient not found</p>
      </div>
    )
  }

  return (
    <AdmissionsPage 
      admissions={admissions}
      patientName={patient.name}
      patientId={patient.patient_id}
    />
  )
}