"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function createSurgery(formData: FormData) {
  const surgery_name = formData.get("surgery_name") as string
  const description = formData.get("description") as string
  const cost = Number.parseFloat(formData.get("cost") as string)

  await prisma.surgery.create({
    data: {
      surgery_name,
      description,
      cost,
    }, 
  })

  revalidatePath("/list/services/surgery")
}

