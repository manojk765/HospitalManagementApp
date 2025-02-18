import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patient_id, service_name, quantity, total_cost ,service_date} = body;

    if (!patient_id || !service_name || !quantity || total_cost === undefined || !service_date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const startOfDay = new Date(service_date);
    startOfDay.setHours(0, 0, 0, 0); 

    const endOfDay = new Date(service_date);
    endOfDay.setHours(23, 59, 59, 999); 

    const existingService = await prisma.patientService.findFirst({
      where: {
        patient_id,
        service_name,
        service_date: {
          gte: startOfDay,
          lt: endOfDay, 
        },
      },
    });

    if (existingService) {
      return NextResponse.json(
        { error: "Service for today is already added. Please update the existing service." },
        { status: 400 }
      );
    }

    // Create the new patient service entry
    const patientService = await prisma.patientService.create({
      data: {
        patient_id,
        service_name,
        service_date: new Date(service_date),
        quantity,
        total_cost,
        is_paid: false,
      },
    });

    return NextResponse.json(patientService);
  } catch (error) {
    console.error("Error creating patient service:", error);
    return NextResponse.json(
      { error: "Failed to create patient service" },
      { status: 500 }
    );
  }
}
