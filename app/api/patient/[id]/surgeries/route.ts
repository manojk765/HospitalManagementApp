import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Extract the patient ID from the request URL
    const url = new URL(req.url);
    const patientId = url.pathname.split('/').slice(-2, -1)[0];  // Extract the [id] part

    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const surgeries = await prisma.patientSurgery.findMany({
      where: { patient_id: patientId },
      orderBy: [{ surgery_date: "desc" }, { surgery_name: "asc" }],
    });

    return NextResponse.json(surgeries);
  } catch (error) {
    console.error("Error fetching patient surgeries:", error);
    return NextResponse.json(
      { error: "Error fetching patient surgeries" },
      { status: 500 }
    );
  }
}
