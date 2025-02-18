import { NextResponse } from "next/server";
import prisma from '@/lib/prisma'; 

export async function DELETE(request: Request) {
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

    // Perform the deletion
    const deletedTest = await prisma.patientTests.delete({
      where: {
        patient_id_test_name_test_date: {
          patient_id: patient_id,
          test_name: test_name,
          test_date: new Date(test_date), 
        },
      },
    });

    // Return the deleted service as the response
    return NextResponse.json(deletedTest);

  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete service: ${error}` },
      { status: 500 }
    );
  }
}
