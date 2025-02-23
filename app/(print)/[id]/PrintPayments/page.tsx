// app/patients/[id]/payments/page.tsx
import prisma from "@/lib/prisma"
import PaymentsPage from "./PaymentsPage"

async function getPatientData(id: string) {
  const patient = await prisma.patient.findUnique({
    where: { patient_id: id }
  })
  return patient
}

async function getPatientPayments(patientId: string) {
  const payments = await prisma.payment.findMany({
    where: { 
      patient_id: patientId,
      discharged: false 
    },
    orderBy: { payment_date: "desc" }
  })
  return payments
}

export default async function PatientPaymentsPage({ params }: { params: { id: string } }) {
  const patientId = params.id
  const patient = await getPatientData(patientId)
  const payments = await getPatientPayments(patientId)

  if (!patient) {
    return (
      <div className="p-6 bg-white">
        <p className="text-red-500">Patient not found</p>
      </div>
    )
  }

  return (
    <PaymentsPage 
      payments={payments}
      patientName={patient.name}
      patientId={patient.patient_id}
    />
  )
}
