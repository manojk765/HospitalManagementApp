import ServiceForm from "@/components/forms/ServiceForm"
import { updateService } from "../action"
import prisma from "@/lib/prisma"

export default async function EditServicePage({ params }: { params: { service_name: string } }) {
  // Decode the service_name to handle URL encoding (e.g., %20 becomes space)
  const serviceName = decodeURIComponent(params.service_name);

  const service = await prisma.services.findUnique({
    where: { service_name: serviceName },
  })

  if (!service) {
    return <div>Service not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Service</h1>
      <ServiceForm initialData={service} onSubmit={updateService} />
    </div>
  )
}
