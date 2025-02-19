// app/api/patient/[id]/route.ts
import { NextResponse } from 'next/server'
import prisma  from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = params.id

    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      )
    }

    const patient = await prisma.patient.findUnique({
      where: {
        patient_id : patientId
      },
      select: {
        patient_id: true,
        name: true,
        email: true
      }
    })

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(patient)
  } catch (error) {
    console.error('Error fetching patient:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient' },
      { status: 500 }
    )
  }
}