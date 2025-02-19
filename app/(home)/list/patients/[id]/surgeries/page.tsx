import type { Decimal } from "@prisma/client/runtime/library"
import prisma from "@/lib/prisma"
import SurgeriesComponent from "./SurgeriesComponent"

export type GroupedSurgery = {
  surgery_name: string
  surgery_date: Date
  quantity: number
  total_cost: Decimal
  surgery_description: string
  is_paid: boolean
}

async function getPatientSurgeries(id: string) {
  const surgeries = await prisma.patientSurgery.findMany({
    where: { patient_id: id },
    orderBy: [{ surgery_date: "desc" }, { surgery_name: "asc" }],
  })
  return surgeries
}

export default async function PatientSurgeriesPage({
  params,
}: {
  params: { id: string }
}) {
  const surgeries = await getPatientSurgeries(params.id)

  return <SurgeriesComponent surgeries={surgeries} patientId={params.id} />
}

