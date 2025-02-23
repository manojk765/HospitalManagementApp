import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET request handler
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Extract the expense ID from the URL

    if (!id) {
      return NextResponse.json({ error: 'Expense ID is missing' }, { status: 400 });
    }

    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
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

// PUT request handler
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Extract the expense ID from the URL

    if (!id) {
      return NextResponse.json({ error: 'Expense ID is missing' }, { status: 400 });
    }

    const body = await request.json();

    const expense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: {
        ...body,
        amount: parseFloat(body.amount), // Ensure amount is stored as a float
        date: new Date(body.date),       // Ensure date is stored as a valid Date object
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

// DELETE request handler
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Extract the expense ID from the URL

    if (!id) {
      return NextResponse.json({ error: 'Expense ID is missing' }, { status: 400 });
    }

    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });

    return new NextResponse(null, { status: 204 }); // Return 204 No Content on successful deletion
  } catch (error) {
    console.error("Error is:", error);
    return NextResponse.json(
      { error: 'Error deleting expense' },
      { status: 500 }
    );
  }
}
