"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function createTest(formData: FormData) {
  const test_name = formData.get("test_name") as string
  const description = formData.get("description") as string
  const cost = Number.parseFloat(formData.get("cost") as string)

  await prisma.labTest.create({
    data: {
      test_name,
      description,
      cost,
    },
  })

  revalidatePath("/list/services/tests")
}

