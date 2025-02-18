import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const services = await prisma.patientService.findMany({
      where: { patient_id: params.id },
      orderBy: [
        { service_date: 'desc' },
        { service_name: 'asc' }
      ]
    });
    
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}