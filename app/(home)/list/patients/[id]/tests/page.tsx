import type { Decimal } from "@prisma/client/runtime/library"
import prisma from "@/lib/prisma"
import TestsComponent from "./TestsComponent"

export type GroupedTest = {
  test_name: string
  test_date: Date
  quantity: number
  total_cost: Decimal
  result_description: string
  is_paid: boolean
}

async function getPatientTests(id: string) {
  const tests = await prisma.patientTests.findMany({
    where: { patient_id: id },
    orderBy: [{ test_date: "desc" }, { test_name: "asc" }],
  })
  return tests
}

type Params = Promise<{id : string}>

export default async function PatientTestsPage( props : {params : Params} ) {
  const params = await props.params

  const tests = await getPatientTests(params.id)

  return <TestsComponent tests={tests} patientId={params.id} />
}

