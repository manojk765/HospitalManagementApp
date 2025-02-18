import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";  


export async function GET() { 
    try {
        const rooms = await prisma.admission.findMany({
        select: {
            patient_id: true,
            room_id : true,
            admittedDate: true,
            dischargeDate: true
        },
        orderBy: { patient_id : "desc" },
        });
    
        return NextResponse.json(rooms);
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return NextResponse.json(
        { error: "Failed to fetch rooms" },
        { status: 500 }
        );
    }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, roomId, admittedDate } = body;

    if (!patientId || !roomId || !admittedDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const admittedDateParsed = new Date(admittedDate);

    // Check if the patient is already admitted
    const existingAdmission = await prisma.admission.findFirst({
      where: {
        patient_id: patientId,
        dischargeDate: null,
      },
    });

    if (existingAdmission) {
      return NextResponse.json(
        { error: "Patient is already admitted. Please discharge the patient first." },
        { status: 400 }
      );
    }

    // Check for the patient's previous admission and ensure admittedDate is valid
    const previousAdmission = await prisma.admission.findFirst({
      where: {
        patient_id: patientId,
        dischargeDate: {
          not: null,
        },
      },
      orderBy: {
        dischargeDate: 'desc',
      },
    });

    // Ensure the admitted date is after the discharge date of the previous admission
    if (previousAdmission?.dischargeDate) {
      const dischargeDateParsed = new Date(previousAdmission.dischargeDate);
      if (admittedDateParsed <= dischargeDateParsed) {
        return NextResponse.json(
          { error: "The admitted date must be after the last discharge date." },
          { status: 400 }
        );
      }
    }

    // Proceed to create a new admission
    const newAdmission = await prisma.admission.create({
      data: {
        patient_id: patientId,
        room_id: parseInt(roomId),
        admittedDate: admittedDateParsed,
        dischargeDate: null, // Not discharged yet
      },
    });

    return NextResponse.json(newAdmission);
  } catch (error) {
    console.error("Error creating new Admission:", error);
    return NextResponse.json(
      { error: "Failed to create new Admission" },
      { status: 500 }
    );
  }
}
