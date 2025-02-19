"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteTest(formData: FormData) {
  const test_name = formData.get("test_name") as string

  await prisma.labTest.delete({
    where: { test_name  },
  })

    revalidatePath("/list/services/tests")
  
}

 