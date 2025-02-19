import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function PUT(request: Request) { 
  try {
    // Parse the URL to access search parameters
    const { searchParams } = new URL(request.url);
    
    const patient_id = searchParams.get('patient_id');
    const service_name = searchParams.get('service_name');
    const service_date = searchParams.get('service_date');
    
    // Validate if all required parameters are present
    if (!patient_id || !service_name || !service_date) {
      return NextResponse.json(
        { error: "Missing required query parameters" },
        { status: 400 }
      );
    }

    const { quantity, total_cost } = await request.json();

    const startOfDay = new Date(service_date);
    startOfDay.setUTCHours(0, 0, 0, 0); 

    const endOfDay = new Date(service_date);
    endOfDay.setUTCHours(23, 59, 59, 999); // Set time to the end of the day (23:59:59)

    const updatedService = await prisma.patientService.updateMany({
      where: {
        patient_id: patient_id,
        service_name: service_name,
        service_date: {
          gte: startOfDay, // greater than or equal to start of the day
          lte: endOfDay,   // less than or equal to end of the day
        },
      },
      data: {
        quantity,
        total_cost,
        is_paid: false,
      },
    });

    if (updatedService.count === 0) {
      // If no service was updated (i.e., no matching record found)
      return NextResponse.json(
        { error: "No service found for the given date" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Service updated successfully", updatedService });

  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update service: ${error}` },
      { status: 500 }
    );
  }
}
