"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function createService(formData: FormData) {
  const service_name = formData.get("service_name") as string
  const description = formData.get("description") as string
  const cost = Number.parseFloat(formData.get("cost") as string)

  await prisma.services.create({
    data: {
      service_name,
      description,
      cost,
    },
  })

  revalidatePath("/services")
}

