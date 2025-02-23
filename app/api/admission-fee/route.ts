import { NextResponse } from "next/server";
import prisma from '@/lib/prisma'; 

export async function POST(request: Request) {
    try {
        // Parse JSON body from request
        const { patient_id, room_id, admittedDate, dischargeDate, totalDays, totalCost } = await request.json();
        
        // Insert the new PatientAdmissionFee entry
        const newAdmissionFee = await prisma.patientAdmissionFee.create({
          data: {
            patient_id: patient_id,
            room_id: room_id,
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
