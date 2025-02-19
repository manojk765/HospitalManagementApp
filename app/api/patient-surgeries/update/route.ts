import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const patient_id = searchParams.get("patient_id")
    const surgery_name = searchParams.get("surgery_name")
    const surgery_date = searchParams.get("surgery_date")

    const body = await req.json()
    const { quantity, total_cost, surgery_description } = body

    if (!patient_id || !surgery_name || !surgery_date) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const updatedSurgery = await prisma.patientSurgery.update({
      where: {
        patient_id_surgery_name_surgery_date: {
          patient_id,
          surgery_name,
          surgery_date: new Date(surgery_date),
        },
      },
      data: {
        quantity,
        total_cost,
        surgery_description,
      },
    })

    return NextResponse.json(updatedSurgery)
  } catch (error) {
    console.error("Error updating surgery:", error)
    return NextResponse.json({ error: "Error updating surgery" }, { status: 500 })
  }
}

