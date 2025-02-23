import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const patientId = url.pathname.split('/').slice(-2, -1)[0]; 
    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const services = await prisma.patientService.findMany({
      where: { patient_id: patientId },
      orderBy: [
        { service_date: 'desc' },
        { service_name: 'asc' }
      ]
    });
    
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch services: ${error}` },
      { status: 500 }
    );
  }
}
