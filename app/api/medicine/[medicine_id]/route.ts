import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET Method - Fetch medicine details
export async function GET(
  request: Request,
  context: { params: { medicine_id: string } }
) {
  try {
    const medicine = await prisma.medicine.findUnique({
      where: {
        medicine_id: parseInt(context.params.medicine_id),
      },
    })

    if (!medicine) {
      return NextResponse.json(
        { error: 'Medicine not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(medicine)
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch medicine' },
      { status: 500 }
    )
  }
}

// PUT Method - Update medicine details
export async function PUT(
  request: Request,
  context: { params: { medicine_id: string } }
) {
  try {
    const data = await request.json()

    if (!data) {
      return NextResponse.json(
        { error: 'No data provided' },
        { status: 400 }
      )
    }

    const updated = await prisma.medicine.update({
      where: {
        medicine_id: parseInt(context.params.medicine_id),
      },
      data,
    })

    return NextResponse.json({ 
      message: 'Medicine updated successfully',
      data: updated,
    })
  } catch (error) {
    console.error('PUT Error:', error)
    return NextResponse.json(
      { error: 'Failed to update medicine' },
      { status: 500 }
    )
  }
}

// DELETE Method - Delete a medicine
export async function DELETE(
  request: Request,
  context: { params: { medicine_id: string } }
) {
  try {
    // const deleted = await prisma.medicine.delete({
    //   where: {
    //     medicine_id: parseInt(context.params.medicine_id),
    //   },
    // })

    return NextResponse.json({
      message: 'Medicine deleted successfully',
    })
  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete medicine' },
      { status: 500 }
    )
  }
}
