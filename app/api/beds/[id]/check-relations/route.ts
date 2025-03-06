import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const segments = url.pathname.split("/")

    // url is /api/beds/[id]/check-relations
    const id = segments[segments.length - 2] // [id] is the second from last

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 })
    }

    const bed = await prisma.beds.findUnique({
      where: { id: parseInt(id) },
      include: {
        Admission: true,
        PatientAdmissionFee: true,
      },
    })

    if (!bed) {
      return NextResponse.json({ error: "Bed not found" }, { status: 404 })
    }

    const hasRelatedRecords = bed.Admission.length > 0 || bed.PatientAdmissionFee.length > 0

    return NextResponse.json({ hasRelatedRecords })
  } catch (error) {
    console.error("Error checking bed relations:", error)
    return NextResponse.json(
      { error: "Failed to check bed relations" },
      { status: 500 }
    )
  }
}
