import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Extract the patient ID from the request URL
    const url = new URL(request.url);
    const patientId = url.pathname.split('/').slice(-2, -1)[0]; // Extract the [id] part

    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const tests = await prisma.patientTests.findMany({
      where: { patient_id: patientId },
      orderBy: [
        { test_date: "desc" },
        { test_name: "asc" }
      ]
    });
    
    return NextResponse.json(tests);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch tests: ${error}` },
      { status: 500 }
    );
  }
}
