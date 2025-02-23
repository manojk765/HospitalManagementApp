import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { vendor_pharm_name, vendor_name, contact_number, email, address, city, state, zip_code } = body;

  try {
    const existingManufacturer = await prisma.manufacturer.findUnique({
      where: { vendor_pharm_name },
    });

    if (existingManufacturer) {
      return NextResponse.json({ error: 'Manufacturer with this pharmacy name already exists' }, { status: 400 });
    }

    const manufacturer = await prisma.manufacturer.create({
      data: {
        vendor_pharm_name,
        vendor_name,
        contact_number,
        email,
        address,
        city,
        state,
        zip_code,
      },
    });

    return NextResponse.json(manufacturer, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const manufacturers = await prisma.manufacturer.findMany({
      select: {
        vendor_pharm_name: true,
      },
      orderBy: {
        vendor_pharm_name: 'asc',
      },
    });

    return NextResponse.json(manufacturers);
  } catch (error) {
    console.log("error:", error)
    return NextResponse.json({ error: 'Failed to fetch manufacturers' }, { status: 500 });
  }
}