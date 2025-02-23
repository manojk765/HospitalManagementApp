import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  context: { params: { vendor_pharm_name: string } }
) {
  try {
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { 
        vendor_pharm_name: context.params.vendor_pharm_name 
      },
      include: {
        medicines: {
          select: {
            medicine_name: true
          }
        }
      }
    })

    if (!manufacturer) {
      return NextResponse.json(
        { error: 'Manufacturer not found' }, 
        { status: 404 }
      )
    }

    return NextResponse.json(manufacturer)
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch manufacturer' }, 
      { status: 500 }
    )
  } 
}

export async function PUT(
  request: Request,
  context: { params: { vendor_pharm_name: string } }
) {
  try {
    const data = await request.json()
    
    // Validate if data exists
    if (!data) {
      return NextResponse.json(
        { error: 'No data provided' },
        { status: 400 }
      )
    }

    // Remove read-only fields from update data
    const {  ...updateData } = data

    const updated = await prisma.manufacturer.update({
      where: { 
        vendor_pharm_name: context.params.vendor_pharm_name 
      },
      data: {
        vendor_name: updateData.vendor_name,
        contact_number: updateData.contact_number,
        email: updateData.email || null,
        address: updateData.address || null,
        city: updateData.city || null,
        state: updateData.state || null,
        zip_code: updateData.zip_code || null,
      }
    })

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update manufacturer' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      message: 'Manufacturer updated successfully',
      data: updated 
    })

  } catch (error) {
    console.error('PUT Error:', error)
    return NextResponse.json(
      { error: 'Failed to update manufacturer' },
      { status: 500 }
    )
  }
}

// DELETE Method
export async function DELETE(
  request: Request,
  context: { params: { vendor_pharm_name: string } }
) {
  try {
    const deleted = await prisma.manufacturer.delete({
      where: { 
        vendor_pharm_name: context.params.vendor_pharm_name 
      }
    })

    if (!deleted) {
      return NextResponse.json(
        { error: 'Manufacturer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Manufacturer and associated medicines deleted successfully'
    })
  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete manufacturer' },
      { status: 500 }
    )
  }
}