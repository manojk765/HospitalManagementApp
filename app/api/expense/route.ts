import { NextResponse } from 'next/server';
  import { PrismaClient } from '@prisma/client';
  
  const prisma = new PrismaClient();
  
  export async function GET(req: Request) {
    try {
      // Extract query parameters
      const { searchParams } = new URL(req.url);
      const searchDate = searchParams.get('date') || undefined;
      const searchQuery = searchParams.get('search') || undefined;
  
      // Base query
      let whereClause = {};
  
      // If a searchDate is provided, filter by that date
      if (searchDate) {
        whereClause = {
          ...whereClause,
          date: searchDate,
        };
      }
  
      if (searchQuery) {
        whereClause = {
          ...whereClause,
          OR: [
            {
              title: {
                contains: searchQuery,
                mode: 'insensitive',
              },
            },
            {
              category: {
                contains: searchQuery,
                mode: 'insensitive',
              },
            },
          ],
        };
      }
  
      const expenses = await prisma.expense.findMany({
        where: whereClause,
        orderBy: {
          date: 'desc',
        },
      });
  
      return NextResponse.json(expenses);
    } catch (error) {
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
      return NextResponse.json(
        { error: 'Error creating expense' },
        { status: 500 }
      );
    }
  }
  
  
  