import { deleteService } from "../action"
import prisma from "@/lib/prisma"
import Link from "next/link"

export default async function DeleteServicePage({ params }: { params: { service_name: string } }) {
  const serviceName = decodeURIComponent(params.service_name)

  const service = await prisma.services.findUnique({
    where: { service_name: serviceName },
    include: { services : true },  
  })

  if (!service) {
    return <div>Service not found</div>
  }

  const hasPatients = service.services.length > 0;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Delete Service</h1>

      {/* If the service has patients, display a message and a link to go back */}
      {hasPatients ? (
        <div className="bg-red-100 text-red-600 p-4 rounded-md">
          <p className="font-medium">This service has patients attached and cannot be deleted.</p>
          <Link 
            href="/list/services/list"
            className="inline-flex items-center mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Go Back
          </Link>
        </div>
      ) : (
        // If there are no patients, show the delete confirmation
        <div>
          <p>Are you sure you want to delete the service "{service.service_name}"?</p>
          <form action={deleteService} method="POST">
            <input type="hidden" name="service_name" value={service.service_name} />
            <button
              type="submit"
              className="px-4 py-2 mt-4 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Service
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
