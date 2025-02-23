import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
  
const prisma = new PrismaClient();
  
  export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const search = searchParams.get('search');
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
  
      // Define the specific type for the where clause
      const where: {
        OR?: { title?: { contains: string }; description?: { contains: string } }[];
        date?: { gte?: Date; lte?: Date };
      } = {};
  
      if (search) {
        where.OR = [
          { title: { contains: search } },
          { description: { contains: search } }
        ];
      }
  
      if (startDate || endDate) {
        where.date = {};
        if (startDate) {
          where.date.gte = new Date(startDate);
        }
        if (endDate) {
          where.date.lte = new Date(endDate);
        }
      }
  
      const expenses = await prisma.expense.findMany({
        where,
        orderBy: {
          date: 'desc',
        },
      });
  
      return NextResponse.json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return NextResponse.json(
        { error: 'Error fetching expenses' },
        { status: 500 }
      );
    }
  }
  

  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const expense = await prisma.expense.create({
        data: {
          ...body,
          amount: parseFloat(body.amount),
          date: new Date(body.date),
        },
      });
      return NextResponse.json(expense);
    } catch (error) {
      console.error("Error is:", error);
      return NextResponse.json(
        { error: 'Error creating expense' },
        { status: 500 }
      );
    }
  }
  
  
  