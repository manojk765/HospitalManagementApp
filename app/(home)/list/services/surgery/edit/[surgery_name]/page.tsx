import SurgeryForm from "@/components/forms/SurgeryForm"
import { updateSurgery } from "../action"
import prisma from "@/lib/prisma"

type Params = Promise<{ surgery_name : string }> 

export default async function EditSurgeryPage( props : {params : Params} ) {
  const params = await props.params
  
  const surgeryName = decodeURIComponent(params.surgery_name);

  const surgery = await prisma.surgery.findUnique({
    where: { surgery_name : surgeryName },
  })

  if (!surgery) {
    return <div>Service not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Surgery</h1>
      <SurgeryForm initialData={surgery} onSubmit={updateSurgery} />
    </div>
  )
}
 