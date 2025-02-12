import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, gender, date_of_birth, age, contact_number, email, address, city, state, zip_code, category } = body;

    // Generate Patient ID in the format: PADDMMYYxxxx
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = String(today.getFullYear()).slice(-2);

    const patientCount = await prisma.patient.count({
      where: {
        registration_date: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
          lte: new Date(today.setHours(23, 59, 59, 999)),
        },
      },
    });

    const newPatientId = `PA${day}${month}${year}${String(patientCount + 1).padStart(4, '0')}`;

    // Create new patient in the database
    const newPatient = await prisma.patient.create({
      data: {
        patient_id: newPatientId,
        name,
        gender,
        date_of_birth: new Date(date_of_birth),
        age: parseInt(age, 10),
        contact_number,
        email,
        address,
        city,
        state,
        zip_code,
        category,
        registration_date: new Date(),
      },
    });

    return NextResponse.json({ message: 'Patient added successfully', patient_id: newPatient.patient_id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add patient' }, { status: 500 });
  }
}
