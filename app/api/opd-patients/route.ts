import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request : Request){
  try {
    const body = await request.json() ;
    const { name, contact, doctor_id, purpose, amount } = body ;

    const today = new Date().toISOString().split('T')[0] 

    const patientCountToday = await prisma.opdPatient.count({
      where: {
        visitDate: {
          gte: new Date(today), // Beginning of today
          lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000), // End of today
        },
      },
    })

    const newPatientId = `P${(patientCountToday + 1).toString().padStart(4, '0')}`

    const patient = await prisma.opdPatient.create({
      data: {
        id: newPatientId, 
        name,
        contact,
        visitDate: new Date(), 
        doctor_id,
        purpose,
        amount: Number.parseFloat(amount),
      },
    })

    return NextResponse.json(patient) 
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      status : 500 ,
      error : `${error}`
    })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    let patients;

    if (date) {
      // Parse the provided date
      const parsedDate = new Date(date);
      const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

      // Fetch patients who visited on the specified date
      patients = await prisma.opdPatient.findMany({
        where: {
          visitDate: {
            gte: startOfDay, // start of the day
            lt: endOfDay,    // end of the day
          },
        },
        include: {
          doctor: true, // Assuming you have a relation to the doctor
        },
        orderBy: {
          visitDate: 'asc',
        },
      });
    } else {
      // Fetch all patients when no date is provided
      patients = await prisma.opdPatient.findMany({
        include: {
          doctor: true, // Assuming you have a relation to the doctor
        },
        orderBy: {
          visitDate: 'asc',
        },
      });
    }

    // Return the patients as a JSON response
    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patient records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient records' },
      { status: 500 }
    );
  }
}
