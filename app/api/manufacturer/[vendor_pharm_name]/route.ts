import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET Method
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const vendor_pharm_name = url.pathname.split('/').pop(); // Extract vendor_pharm_name from URL

    if (!vendor_pharm_name) {
      return NextResponse.json({ error: 'Vendor name missing' }, { status: 400 });
    }

    const manufacturer = await prisma.manufacturer.findUnique({
      where: { vendor_pharm_name },
      include: {
        medicines: {
          select: { medicine_name: true }
        }
      }
    });

    if (!manufacturer) {
      return NextResponse.json({ error: 'Manufacturer not found' }, { status: 404 });
    }

    return NextResponse.json(manufacturer);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch manufacturer' }, { status: 500 });
  }
}

// PUT Method
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const vendor_pharm_name = url.pathname.split('/').pop(); // Extract vendor_pharm_name from URL

    if (!vendor_pharm_name) {
      return NextResponse.json({ error: 'Vendor name missing' }, { status: 400 });
    }

    const data = await request.json();

    if (!data) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    const updated = await prisma.manufacturer.update({
      where: { vendor_pharm_name },
      data: {
        vendor_name: data.vendor_name,
        contact_number: data.contact_number,
        email: data.email || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        zip_code: data.zip_code || null,
      }
    });

    return NextResponse.json({ message: 'Manufacturer updated successfully', data: updated });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update manufacturer' }, { status: 500 });
  }
}

// DELETE Method
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const vendor_pharm_name = url.pathname.split('/').pop(); // Extract vendor_pharm_name from URL

    if (!vendor_pharm_name) {
      return NextResponse.json({ error: 'Vendor name missing' }, { status: 400 });
    }

    await prisma.manufacturer.delete({
      where: { vendor_pharm_name }
    });

    return NextResponse.json({ message: 'Manufacturer and associated medicines deleted successfully' });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete manufacturer' }, { status: 500 });
  }
}