import BedForm from "@/components/forms/BedForm"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditBedPage({ params }: { params: { id: string } }) {
  const bed = await prisma.beds.findUnique({
    where: { id: parseInt(params.id) },
  })

  if (!bed) {
    notFound()
  }

  return <BedForm bed={bed} isEdit />
  
}