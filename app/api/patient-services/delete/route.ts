import { NextResponse } from "next/server";
import prisma from '@/lib/prisma'; 

export async function DELETE(request: Request) {
  try {
    // Parse the URL to access search parameters
    const { searchParams } = new URL(request.url);
    
    const patient_id = searchParams.get('patient_id');
    let service_name = searchParams.get('service_name');
    const service_date = searchParams.get('service_date');

    if (!patient_id || !service_name || !service_date) {
      return NextResponse.json(
        { error: "Missing required query parameters" },
        { status: 400 }
      );
    }

    service_name = decodeURIComponent(service_name)
    
    const startOfDay = new Date(service_date);
    startOfDay.setHours(0, 0, 0, 0); 

    const endOfDay = new Date(service_date);
    endOfDay.setHours(23, 59, 59, 999);  

    const deletedServices = await prisma.patientService.deleteMany({
      where: {
        patient_id,
        service_name,
        service_date: {
          gte: startOfDay, 
          lt: endOfDay,    
        },
      },
    });

    // If no service was deleted, return a 404 response
    if (deletedServices.count === 0) {
      return NextResponse.json(
        { error: "No service found for the given date" },
        { status: 404 }
      );
    }

    // Return the count of deleted services as the response
    return NextResponse.json({ message: "Service(s) deleted", count: deletedServices.count });

  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete service: ${error}` },
      { status: 500 }
    );
  }
}
