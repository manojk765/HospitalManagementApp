import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { error } from "console";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      patient_id,
      test_name,
      result_description,
      quantity,
      total_cost,
    } = body;

    if (
      !patient_id ||
      !test_name ||
      !result_description ||
      !quantity ||
      total_cost === undefined 
      // ||
      // !test_date
    ) {
      return NextResponse.json(
        { error: `Missing required fields ${error}` },
        { status: 400 }
      );
    }

    const patientTest = await prisma.patientTests.create({
      data: {
        patient_id,
        test_name,
        result_description ,
        quantity,
        total_cost,
        test_date: new Date(),
        is_paid: false, 
      },
    });

    // Return the created patient test record
    return NextResponse.json(patientTest);
  } catch (error) {
    console.error("Error creating patient test:", error);
    return NextResponse.json(
      { error: "Failed to create patient test" },
      { status: 500 }
    );
  }
}
