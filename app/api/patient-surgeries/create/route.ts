import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { patient_id, surgery_name, quantity, total_cost, surgery_date, surgery_description } = body

    const newSurgery = await prisma.patientSurgery.create({
      data: {
        patient_id,
        surgery_name,
        quantity,
        total_cost,
        surgery_date: new Date(surgery_date),
        surgery_description,
        is_paid: false,
      },
    })

    return NextResponse.json(newSurgery)
  } catch (error) {
    console.error("Error creating surgery:", error)
    return NextResponse.json({ error: "Error creating surgery" }, { status: 500 })
  }
}

