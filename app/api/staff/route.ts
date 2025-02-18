import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

  export interface StaffFormData {
    staff_id: string;
    name: string;
    role: string;
    contact_number: string;
    email: string;
    shift_time: string;
    department_name: string;
    salary: number;
  }

  export async function POST(request: NextRequest) {
    try {
      const body: Omit<StaffFormData, 'staff_id'> = await request.json();
  
      const lastStaff = await prisma.staff.findFirst({
        orderBy: {
          staff_id: 'desc',
        },
      });
  
      let newStaffId = 1;
      if (lastStaff) {
        const lastStaffIdNumber = parseInt(lastStaff.staff_id.replace('S', ''), 10);
        newStaffId = lastStaffIdNumber + 1;
      }
  
      const generatedStaffId = `S${newStaffId.toString().padStart(3, '0')}`;
  
      const staff = await prisma.staff.create({
        data: {
          ...body,
          staff_id: generatedStaffId,
        },
      });
  
      return NextResponse.json(staff);
    } catch (error) {
      console.error('Error creating staff member:', error);
      return NextResponse.json(
        { error: 'Error creating staff member' },
        { status: 500 }
      );
    }
  }
  