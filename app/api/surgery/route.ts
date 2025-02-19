import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch all surgeries
export async function GET() {
  try {
    const surgeries = await prisma.surgery.findMany({
      select: {
        surgery_name: true,
        cost: true,
        description: true,
      },
      orderBy: {
        surgery_name: 'asc',
      },
    });

    return NextResponse.json(surgeries);
  } catch (error) {
    console.error("Error fetching surgeries:", error);
    return NextResponse.json(
      { error: "Failed to fetch surgeries" },
      { status: 500 }
    );
  }
}

// POST: Create a new surgery
export async function POST(request: Request) {
  const data = await request.json();
  try {
    const surgery = await prisma.surgery.create({
      data: {
        surgery_name: data.surgery_name,
        description: data.description,
        cost: Number.parseFloat(data.cost),
      },
    });
    return NextResponse.json(surgery);
  } catch (error) {
    console.error("Error creating surgery:", error);
    return NextResponse.json(
      { error: "Error creating surgery" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing surgery
export async function PUT(request: Request) {
  const data = await request.json();
  try {
    const surgery = await prisma.surgery.update({
      where: { surgery_name: data.surgery_name },
      data: {
        description: data.description,
        cost: Number.parseFloat(data.cost),
      },
    });
    return NextResponse.json(surgery);
  } catch (error) {
    console.error("Error updating surgery:", error);
    return NextResponse.json(
      { error: "Error updating surgery" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a surgery by surgery_name
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const surgery_name = searchParams.get("surgery_name");
  if (!surgery_name) {
    return NextResponse.json(
      { error: "Surgery name is required" },
      { status: 400 }
    );
  }
  try {
    await prisma.surgery.delete({
      where: { surgery_name },
    });
    return NextResponse.json({ message: "Surgery deleted successfully" });
  } catch (error) {
    console.error("Error deleting surgery:", error);
    return NextResponse.json(
      { error: "Error deleting surgery" },
      { status: 500 }
    );
  }
}
