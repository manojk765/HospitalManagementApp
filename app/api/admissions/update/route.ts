import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');

  if (!patientId) {
    return NextResponse.json(
      { error: "Missing required query parameters" },
      { status: 400 }
    );
  }

  try {
    const admissions = await prisma.admission.findMany({
      where: {
        patient_id : patientId ,
      },
      include: {
        patient: true, 
      },
    });

    return NextResponse.json(admissions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Unable to fetch admissions ${error}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const patientId = searchParams.get('patientId');
    const roomId = searchParams.get('roomId');
    const admittedDate = searchParams.get('admittedDate');

    if (!patientId || !roomId || !admittedDate) {
      return NextResponse.json(
        { error: "Missing required query parameters" },
        { status: 400 }
      );
    }

    const { dischargeDate } = await request.json();

    // Ensure dischargeDate is a valid ISO-8601 formatted string
    const dischargeDateObj = new Date(dischargeDate);
    if (isNaN(dischargeDateObj.getTime())) {
      return NextResponse.json(
        { error: "Invalid dischargeDate format. Expected an ISO-8601 date string." },
        { status: 400 }
      );
    }

    const startOfDay = new Date(admittedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);  
    const endOfDay = new Date(admittedDate);
    endOfDay.setUTCHours(23, 59, 59, 999); 

    const updatedAdmission = await prisma.admission.updateMany({
      where: {
        patient_id: patientId,
        room_id: Number(roomId),
        admittedDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      data: {
        dischargeDate: dischargeDateObj,
      },
    });

    if (updatedAdmission.count === 0) {
      return NextResponse.json(
        { error: "No admission found for the given date" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Admission updated successfully", updatedAdmission });

  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update admission: ${error}` },
      { status: 500 }
    );
  }
}
