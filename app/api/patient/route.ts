import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      select: {
        patient_id: true,
        name: true,
        email: true
      }, 
       orderBy: { patient_id : 'desc' },
      });

      return NextResponse.json(patients);
    } catch (error) {
      console.error("Error fetching services:", error);
      return NextResponse.json(
        { error: "Failed to fetch services" },
        { status: 500 }
      );
    }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      gender, 
      date_of_birth, 
      age, 
      contact_number, 
      email, 
      address, 
      city, 
      state, 
      zip_code, 
      category, 
      doctor_id 
    } = body;

    

    // Validate required fields
    if (!name || !gender || !date_of_birth || !age || !contact_number || !category || !doctor_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate Patient ID in the format: PADDMMYYxxxx
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2);

    // Get patient count for the current day
    const patientCount = await prisma.patient.count({
      where: {
        registration_date: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
          lte: new Date(today.setHours(23, 59, 59, 999)),
        },
      },
    });

    const newPatientId = `PA${day}${month}${year}${String(patientCount + 1).padStart(4, '0')}`;

    // Use a transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Create new patient
      const newPatient = await tx.patient.create({
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

      const patientDoctor = await tx.patientDoctor.create({
        data: {
          patient_id: newPatient.patient_id,
          doctor_id: doctor_id,
        },
      });

      return { newPatient, patientDoctor };
    });

    return NextResponse.json({ 
      message: 'Patient added successfully', 
      patient_id: result.newPatient.patient_id 
    });

  } catch (error) {
    console.error('Error adding patient:', error);
    
    if (error instanceof Error) {
      // Handle specific Prisma errors
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'A patient with this information already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to add patient' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
