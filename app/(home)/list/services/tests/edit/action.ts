"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function updateTest(formData: FormData) {
  const test_name = formData.get("test_name") as string
  const description = formData.get("description") as string
  const cost = Number.parseFloat(formData.get("cost") as string)

  await prisma.labTest.update({
    where: { test_name },
    data: {
      description, 
      cost,
    }, 
  })

  revalidatePath("/list/services/tests")
}
