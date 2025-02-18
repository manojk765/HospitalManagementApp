import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { department_name, head_of_department } = body;

    const existing = await prisma.department.findUnique({
      where: { department_name },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Department already exists' },
        { status: 400 }
      );
    }

    const department = await prisma.department.create({
      data: { department_name, head_of_department },
    });

    return NextResponse.json(department);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating department' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      select: {
        department_name: true, 
      },
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Error fetching departments' },
      { status: 500 }
    );
  }
}