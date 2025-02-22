import { NextResponse } from 'next/server';
  import { PrismaClient } from '@prisma/client';
  
  const prisma = new PrismaClient();
  
  export async function GET(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const expense = await prisma.expense.findUnique({
        where: { id: parseInt(params.id) },
      });
      if (expense) {
        return NextResponse.json(expense);
      } else {
        return NextResponse.json(
          { error: 'Expense not found' },
          { status: 404 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Error fetching expense' },
        { status: 500 }
      );
    }
  }
  
  export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const body = await request.json();
      const expense = await prisma.expense.update({
        where: { id: parseInt(params.id) },
        data: {
          ...body,
          amount: parseFloat(body.amount),
          date: new Date(body.date),
        },
      });
      return NextResponse.json(expense);
    } catch (error) {
      return NextResponse.json(
        { error: 'Error updating expense' },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      await prisma.expense.delete({
        where: { id: parseInt(params.id) },
      });
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      return NextResponse.json(
        { error: 'Error deleting expense' },
        { status: 500 }
      );
    }
  }