import { NextResponse } from 'next/server';
import prisma  from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { test_name, result_description, patient_id, doctor_id } = body;

    const test = await prisma.patientTests.create({
      data: {
        test_name,
        result_description,
        patient_id,
        doctor_id,
        test_date: new Date(),
        is_paid: false,
      },
    });

    return NextResponse.json(test);
  } catch (error) {
    console.error('Error creating test:', error);
    return NextResponse.json(
      { error: 'Failed to create test' },
      { status: 500 }
    );
  }
}