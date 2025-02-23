import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { StaffFormData } from '../route';

// PUT Method - Update staff member
export async function PUT(request: NextRequest) {
  try {
    // Extract staff id from the request URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();  // Get the last part of the URL

    if (!id) {
      return NextResponse.json(
        { error: 'Staff ID not provided' },
        { status: 400 }
      );
    }

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
    console.error("Error updating staff member:", error);  // Log the error
    return NextResponse.json(
      { error: 'Error updating staff member' },
      { status: 500 }
    );
  }
}

// DELETE Method - Delete staff member
export async function DELETE(request: NextRequest) {
  try {
    // Extract staff id from the request URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();  // Get the last part of the URL

    if (!id) {
      return NextResponse.json(
        { error: 'Staff ID not provided' },
        { status: 400 }
      );
    }
    
    await prisma.staff.delete({
      where: { staff_id: id },
    });

    return NextResponse.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error("Error deleting staff member:", error);  // Log the error
    return NextResponse.json(
      { error: 'Error deleting staff member' },
      { status: 500 }
    );
  }
}

// GET Method - Fetch staff member details
export async function GET(request: NextRequest) {
  try {
    // Extract staff id from the request URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();  // Get the last part of the URL

    if (!id) {
      return NextResponse.json(
        { error: 'Staff ID not provided' },
        { status: 400 }
      );
    }

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
    console.error("Error fetching staff member:", error);  // Log the error
    return NextResponse.json(
      { error: 'Error fetching staff member' },
      { status: 500 }
    );
  }
}
