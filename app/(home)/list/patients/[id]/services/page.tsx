import { Decimal } from "@prisma/client/runtime/library";
import prisma from "@/lib/prisma";
import ServicesComponent from "./ServicesComponent";

export type GroupedService = {
  service_name: string;
  service_date: Date;
  quantity: number;
  total_cost: Decimal;  
  is_paid: boolean;
};

async function getPatientServices(id: string) {
  const services = await prisma.patientService.findMany({
    where: { patient_id: id },
    orderBy: [
      { service_date: "desc" },
      { service_name: "asc" }
    ]
  });
  return services;
}

type Params = Promise<{ id : string }> 

export default async function PatientServicesPage(  props : { params: Params } ) {
  const params = await props.params

  const services = await getPatientServices(params.id);
  
  return <ServicesComponent services={services} patientId={params.id} />;
}
