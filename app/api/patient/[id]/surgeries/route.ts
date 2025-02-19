import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id

    const surgeries = await prisma.patientSurgery.findMany({
      where: { patient_id: patientId },
      orderBy: [{ surgery_date: "desc" }, { surgery_name: "asc" }],
    })

    return NextResponse.json(surgeries)
  } catch (error) {
    console.error("Error fetching patient surgeries:", error)
    return NextResponse.json({ error: "Error fetching patient surgeries" }, { status: 500 })
  }
}

