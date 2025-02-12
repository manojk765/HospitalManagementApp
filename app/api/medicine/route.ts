import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const medicine = await prisma.medicine.create({
      data: {
        medicine_name: data.medicine_name,
        stock_quantity: parseInt(data.stock_quantity),
        price_per_unit: parseFloat(data.price_per_unit),
        unit_quantity: parseFloat(data.unit_quantity),
        batch_number: data.batch_number,
        expiry_date: new Date(data.expiry_date),
        manufacturer_name: data.manufacturer_name,
      },
    });

    return NextResponse.json(medicine);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A medicine with this name and manufacturer already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Failed to create medicine' }, { status: 500 });
  }
}