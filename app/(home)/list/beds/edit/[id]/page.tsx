import BedForm from "@/components/forms/BedForm"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

type Params = Promise<{ id : string }>

export default async function EditBedPage( props : { params: Params }) {
  const params = await props.params 
  
  const bed = await prisma.beds.findUnique({
    where: { id: parseInt(params.id) },
  })

  if (!bed) {
    notFound()
  }

  return <BedForm bed={bed} isEdit />
  
} 