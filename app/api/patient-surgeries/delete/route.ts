import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const patient_id = searchParams.get("patient_id")
    const surgery_name = searchParams.get("surgery_name")
    const surgery_date = searchParams.get("surgery_date")

    if (!patient_id || !surgery_name || !surgery_date) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    await prisma.patientSurgery.delete({
      where: {
        patient_id_surgery_name_surgery_date: {
          patient_id,
          surgery_name,
          surgery_date: new Date(surgery_date),
        },
      },
    })

    return NextResponse.json({ message: "Surgery deleted successfully" })
  } catch (error) {
    console.error("Error deleting surgery:", error)
    return NextResponse.json({ error: "Error deleting surgery" }, { status: 500 })
  }
}

