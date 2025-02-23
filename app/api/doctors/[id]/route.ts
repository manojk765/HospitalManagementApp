import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const doctor = await prisma.doctor.update({
      where: { doctor_id: params.id },
      data: body,
    })
    return NextResponse.json(doctor)
  } catch (error) {
    console.error("Error is:", error);
    return NextResponse.json({ error: "Error updating doctor" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { doctor_id: params.id },
      include: {
        prescriptions: true, 
        patients: true,      
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    if (doctor.prescriptions.length > 0 || doctor.patients.length > 0) {
      return NextResponse.json(
        { error: "Doctor cannot be deleted because they have associated prescriptions or patients." },
        { status: 400 }
      );
    }

    await prisma.doctor.delete({
      where: { doctor_id: params.id },
    });

    return NextResponse.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return NextResponse.json({ error: "Error deleting doctor" }, { status: 500 });
  }
}

