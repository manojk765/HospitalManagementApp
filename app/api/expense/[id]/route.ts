import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const expense = await prisma.expense.findUnique({
      where: { id: parseFloat(id) },
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
    console.error("Error is:", error);
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
    const { id } = await Promise.resolve(params);
    const body = await request.json();
    const expense = await prisma.expense.update({
      where: { id: parseInt(id) },
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
    const { id } = await Promise.resolve(params);
    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error is:", error);
    return NextResponse.json(
      { error: 'Error deleting expense' },
      { status: 500 }
    );
  }
}