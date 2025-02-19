import SurgeryForm from "@/components/forms/SurgeryForm"
import { updateSurgery } from "../action"
import prisma from "@/lib/prisma"

export default async function EditSurgeryPage({ params }: { params: { surgery_name : string } }) {
  const surgeryName = decodeURIComponent(params.surgery_name);

  const surgery = await prisma.surgery.findUnique({
    where: { surgery_name : surgeryName },
  })

  if (!surgery) {
    return <div>Service not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Service</h1>
      <SurgeryForm initialData={surgery} onSubmit={updateSurgery} />
    </div>
  )
}
 