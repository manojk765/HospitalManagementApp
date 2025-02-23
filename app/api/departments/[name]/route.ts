import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT request handler
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const name = decodeURIComponent(url.pathname.split("/").pop() || ""); // Extract and decode the department name

    if (!name) {
      return NextResponse.json({ error: 'Department name is missing' }, { status: 400 });
    }

    const body = await request.json();
    
    const department = await prisma.department.update({
      where: { department_name: name },
      data: { head_of_department: body.head_of_department },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error("Error is:", error);
    return NextResponse.json(
      { error: 'Error updating department' },
      { status: 500 }
    );
  }
}

// DELETE request handler
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const name = decodeURIComponent(url.pathname.split("/").pop() || ""); // Extract and decode the department name

    if (!name) {
      return NextResponse.json({ error: 'Department name is missing' }, { status: 400 });
    }
    
    // Check if department has any doctors or staff
    const department = await prisma.department.findUnique({
      where: { department_name: name },
      include: {
        doctors: true,
        staff: true,
      },
    });

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    if (department.doctors.length > 0 || department.staff.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete department with associated doctors or staff' },
        { status: 400 }
      );
    }

    await prisma.department.delete({
      where: { department_name: name },
    });

    return NextResponse.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error("Error is:", error);
    return NextResponse.json(
      { error: 'Error deleting department' },
      { status: 500 }
    );
  }
}

// GET request handler
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const name = decodeURIComponent(url.pathname.split("/").pop() || ""); // Extract and decode the department name

    if (!name) {
      return NextResponse.json({ error: 'Department name is missing' }, { status: 400 });
    }

    const department = await prisma.department.findUnique({
      where: { department_name: name },
      include: {
        doctors: true,
        staff: true,
      },
    });

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(department);
  } catch (error) {
    console.error("Error is:", error);
    return NextResponse.json(
      { error: 'Error fetching department' },
      { status: 500 }
    );
  }
}
