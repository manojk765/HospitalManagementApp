import { NextResponse } from "next/server";
import prisma from '@/lib/prisma'; 

export async function PUT(request: Request) {
  try {
    // Parse the URL to access search parameters 
    const { searchParams } = new URL(request.url);
    
    const patient_id = searchParams.get('patient_id');
    const test_name = searchParams.get('test_name');
    const test_date = searchParams.get('test_date');

    // Validate if all required parameters are present
    if (!patient_id || !test_name || !test_date) {
      return NextResponse.json(
        { error: "Missing required query parameters" },
        { status: 400 }
      );
    }

    // Parse request body for the data to be updated
    const { quantity, total_cost, result_description } = await request.json();

    // Perform the update using composite key
    const updatedTest = await prisma.patientTests.update({
      where: {
        patient_id_test_name_test_date: {
          patient_id: patient_id,
          test_name: test_name,
          test_date: new Date(test_date), 
        },
      },
      data: {
        quantity,
        total_cost,
        result_description,
        is_paid: false,
      },
    });

    // Return the updated service as the response
    return NextResponse.json(updatedTest);

  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update service: ${error}` },
      { status: 500 }
    );
  }
}
