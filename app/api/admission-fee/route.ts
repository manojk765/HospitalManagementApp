import { NextResponse } from "next/server";
import prisma from '@/lib/prisma'; 

export async function POST(request: Request) {
    try {
        // Parse JSON body from request
        const { patientId, roomId, admittedDate, dischargeDate, totalDays, totalCost } = await request.json();
        
        // Insert the new PatientAdmissionFee entry
        const newAdmissionFee = await prisma.patientAdmissionFee.create({
          data: {
            patient_id: patientId,
            room_id: roomId,
            admittedDate: new Date(admittedDate),
            dischargeDate: new Date(dischargeDate),
            totalDays,
            totalCost: parseFloat(totalCost),  
          },
        });

        // Return the newAdmissionFee with a 201 status
        return NextResponse.json(newAdmissionFee, { status: 201 });
    } catch (error) {
        console.error('Error creating admission fee:', error);
        return NextResponse.json({ error: 'Error creating admission fee' }, { status: 500 });
    }
}
