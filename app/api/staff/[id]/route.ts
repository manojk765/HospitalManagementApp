import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

import { StaffFormData } from '../route';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body: StaffFormData = await request.json();
    
    const staff = await prisma.staff.update({
      where: { staff_id: id },
      data: {
        name: body.name,
        role: body.role,
        contact_number: body.contact_number,
        email: body.email,
        shift_time: body.shift_time,
        department_name: body.department_name,
        salary: body.salary,
      },
    });

    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating staff member' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    await prisma.staff.delete({
      where: { staff_id: id },
    });

    return NextResponse.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting staff member' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const staff = await prisma.staff.findUnique({
      where: { staff_id: id },
      include: {
        department: true,
      },
    });

    if (!staff) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching staff member' },
      { status: 500 }
    );
  }
}