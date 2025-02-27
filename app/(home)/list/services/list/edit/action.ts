"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function updateService(formData: FormData): Promise<void> {
  try {
    const service_name = formData.get("service_name");
    if (!service_name || typeof service_name !== 'string') {
      throw new Error("Service name is required");
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

    await prisma.services.update({ 
      where: { service_name },
      data: {
        description,
        cost,
      },
    });

    revalidatePath("/list/services/list");
  } catch (error) {
    console.error("Error updating service:", error);
    // Re-throw the error with a generic message
    throw error instanceof Error 
      ? error 
      : new Error("Failed to update service");
  }
}