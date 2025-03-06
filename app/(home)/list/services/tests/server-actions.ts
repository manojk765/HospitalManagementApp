"use server"

import prisma from "@/lib/prisma"

export async function createLabTest(formData: FormData) {
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
}

export async function updateLabTest(formData: FormData): Promise<void> {
  try {
    const test_name = formData.get("test_name");
    if (!test_name || typeof test_name !== 'string') {
      throw new Error("Test name is required");
    }
    
    const description = formData.get("description");
    if (!description || typeof description !== 'string') {
      throw new Error("Description is required");
    }
    
    const costValue = formData.get("cost");
    if (!costValue || typeof costValue !== 'string') {
      throw new Error("Cost is required");
    }
    
    const cost = Number.parseFloat(costValue);
    if (isNaN(cost)) {
      throw new Error("Cost must be a valid number");
    }

    await prisma.labTest.update({ 
      where: { test_name },
      data: {
        description,
        cost,
      },
    });

  } catch (error) {
    console.error("Error updating lab test:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Failed to update lab test");
  }
}

export async function deleteLabTest(formData: FormData) {
  const test_name = formData.get("test_name") as string

  await prisma.labTest.delete({
    where: { test_name },
  })
}