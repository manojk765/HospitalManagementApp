import prisma from "@/lib/prisma"
import TestsPage from "./TestBill"

async function getPatientData(id: string) {
  const patient = await prisma.patient.findUnique({
    where: { patient_id: id }
  })
  return patient
}

async function getPatientTests(patientId: string) {
  const tests = await prisma.patientTests.findMany({
    where: { 
      patient_id: patientId,
      is_paid: false 
    },
    orderBy: { test_date: "desc" }
  })
  return tests
}

export default async function PatientTestsPage({ params }: { params: { id: string } }) {
  const patientId = params.id
  const patient = await getPatientData(patientId)
  const tests = await getPatientTests(patientId)

  if (!patient) {
    return (
      <div className="p-6 bg-white">
        <p className="text-red-500">Patient not found</p>
      </div>
    )
  }

  return (
    <TestsPage 
      tests={tests}
      patientName={patient.name}
      patientId={patient.patient_id}
    />
  )
}
