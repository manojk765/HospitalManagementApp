"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteSurgery(formData: FormData) {
  const surgery_name = formData.get("surgery_name") as string

  await prisma.surgery.delete({
    where: { surgery_name  },
  })

    revalidatePath("/list/services/surgery")
  
}

 