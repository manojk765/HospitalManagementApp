import prisma from "@/lib/prisma"
import ServicesPage from "./ServiceBill"

async function getPatientData(id: string) {
  const patient = await prisma.patient.findUnique({
    where: { patient_id: id }
  })
  return patient
}

async function getPatientServices(patientId: string) {
  const services = await prisma.patientService.findMany({
    where: { 
      patient_id: patientId,
      is_paid: false 
    },
    orderBy: { service_date: "desc" }
  })
  return services
}

type Params = Promise<{id : string}>

export default async function PatientServicesPage(props : {params : Params}) {
  const params = await props.params
  const patientId = params.id
  const patient = await getPatientData(patientId)
  const services = await getPatientServices(patientId)

  if (!patient) {
    return (
      <div className="p-6 bg-white">
        <p className="text-red-500">Patient not found</p>
      </div>
    )
  }

  return (
    <ServicesPage 
      services={services}
      patientName={patient.name}
      patientId={patient.patient_id}
    />
  )
}
