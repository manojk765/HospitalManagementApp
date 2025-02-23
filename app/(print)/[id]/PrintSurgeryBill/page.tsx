// app/patients/[id]/surgeries/page.tsx
import prisma from "@/lib/prisma"
import SurgeriesPage from "./SurgeryBill"

async function getPatientData(id: string) {
  const patient = await prisma.patient.findUnique({
    where: { patient_id: id }
  })
  return patient
}

async function getPatientSurgeries(patientId: string) {
  const surgeries = await prisma.patientSurgery.findMany({
    where: { 
      patient_id: patientId,
      is_paid: false 
    },
    orderBy: { surgery_date: "desc" }
  })
  return surgeries
}

type Params = Promise<{id : string}>

export default async function PatientSurgeriesPage( props : {params : Params} ) {
  const params = await props.params

  const patientId = params.id
  const patient = await getPatientData(patientId)
  const surgeries = await getPatientSurgeries(patientId)

  if (!patient) {
    return (
      <div className="p-6 bg-white">
        <p className="text-red-500">Patient not found</p>
      </div>
    )
  }

  return (
    <SurgeriesPage 
      surgeries={surgeries}
      patientName={patient.name}
      patientId={patient.patient_id}
    />
  )
}