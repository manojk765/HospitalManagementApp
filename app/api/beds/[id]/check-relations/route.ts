import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    const bed = await prisma.beds.findUnique({
      where: { id },
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
