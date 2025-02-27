import ServiceForm from "@/components/forms/ServiceForm"
import { updateService } from "../action"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

type Params = Promise<{ service_name : string }> 

export default async function EditServicePage(props : {params : Params}) {
  const params = await props.params 
  const serviceName = decodeURIComponent(params.service_name);

  const service = await prisma.services.findUnique({
    where: { service_name: serviceName },
  })

  if (!service) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Service</h1>
      <ServiceForm initialData={service} onSubmit={updateService} />
    </div>
  )
}