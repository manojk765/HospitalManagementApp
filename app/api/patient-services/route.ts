import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const patientId = searchParams.get("patientId")

  if (!patientId) {
    return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
  }

  try {
    const patientServices = await prisma.patientService.findMany({
      where: {
        patient_id: patientId,
      },
      orderBy: {
        service_date: "desc",
      },
    })
    return NextResponse.json(patientServices)
  } catch (error) {
    console.error("Error fetching patient services:", error)
    return NextResponse.json({ error: "Failed to fetch patient services" }, { status: 500 })
  }
}
