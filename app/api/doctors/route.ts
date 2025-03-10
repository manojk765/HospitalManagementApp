import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      select: {
        doctor_id: true,
        name: true,
      },
    });

    return new Response(JSON.stringify(doctors), { status: 200 });
  } catch (error) {
    console.error("Error is:", error);
    return new Response('Failed to fetch doctors', { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
      const body = await request.json();

      const lastDoctor = await prisma.doctor.findFirst({
        orderBy: {
          doctor_id: 'desc',
        },
      });
  
      let newDoctorId = 1;
      if (lastDoctor) {
        // Extract the number part of the last doctor ID
        const lastDoctorIdNumber = parseInt(lastDoctor.doctor_id.replace('D', ''), 10);
        newDoctorId = lastDoctorIdNumber + 1;
      }
  
      // Generate new doctor ID in the format "D001", "D002", etc.
      const generatedDoctorId = `D${newDoctorId.toString().padStart(3, '0')}`;
  
      // Create a new doctor with the generated ID
      const doctor = await prisma.doctor.create({
        data: {
          ...body,
          doctor_id: generatedDoctorId,
        },
      });
  
      return NextResponse.json(doctor);
    } catch (error) {
      console.error('Error creating doctor:', error);
      return NextResponse.json({ error: 'Error creating doctor' }, { status: 500 });
    }
  }

  