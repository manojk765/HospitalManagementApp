"use server"

import { revalidatePath } from "next/cache" 
import prisma from "@/lib/prisma"

export async function deleteService(formData: FormData) {
  const service_name = formData.get("service_name") as string

  await prisma.services.delete({
    where: { service_name },
  })

  revalidatePath('/list/services/tests')
  
}

