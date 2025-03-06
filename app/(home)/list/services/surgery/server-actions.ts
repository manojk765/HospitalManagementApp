"use server"

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

}


export async function updateSurgery(formData: FormData) {
    const surgery_name = formData.get("surgery_name") as string
    const description = formData.get("description") as string
    const cost = Number.parseFloat(formData.get("cost") as string)
  
    await prisma.surgery.update({
      where: { surgery_name },
      data: {
        description, 
        cost,
      }, 
    })
  
}
  

export async function deleteSurgery(formData: FormData) {
    const surgery_name = formData.get("surgery_name") as string
  
    await prisma.surgery.delete({
      where: { surgery_name  },
    })
      
}
  
   