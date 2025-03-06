import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');
  const roomId = searchParams.get('roomId');
  const admittedDate = searchParams.get('admittedDate');

  try {
    // Your logic to delete the admission record
    await prisma.admission.deleteMany({
      where: {
        patient_id: patientId || undefined,
        room_id: roomId ? parseInt(roomId) : undefined,
        admittedDate: admittedDate ? new Date(admittedDate) : undefined,
      },
    });

    return NextResponse.json({ message: 'Admission deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to delete admission' }, { status: 500 });
  }
}
