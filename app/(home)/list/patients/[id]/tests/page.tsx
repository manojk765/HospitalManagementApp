import { Decimal } from "@prisma/client/runtime/library";
import prisma from "@/lib/prisma";
import TestsComponent from "./TestsComponent";

export type GroupedTest = {
  test_name: string;
  test_date: Date;
  quantity: number;
  result_description: string;
  total_cost: Decimal; 
  is_paid: boolean;
};

async function getPatientTests(id: string) {
  const tests = await prisma.patientTests.findMany({
    where: { patient_id: id },
    orderBy: [
      { test_date: "desc" },
      { test_name: "asc" }
    ]
  });
  return tests;
}

export default async function PatientServicesPage({
  params
}: {
  params: { id: string };
}) {
  const tests = await getPatientTests(params.id);
  
  return <TestsComponent tests={tests} patientId={params.id} />;
}
