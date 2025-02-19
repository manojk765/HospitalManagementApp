import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const labTests = await prisma.labTest.findMany({
      select: {
        test_name: true,
        cost: true,
        description: true,
      },
      orderBy: {
        test_name: 'asc',
      },
    });

    return NextResponse.json(labTests);
  } catch (error) {
    console.error("Error fetching lab tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch lab tests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const data = await request.json();
  try {
    const labTest = await prisma.labTest.create({
      data: {
        test_name: data.test_name,
        description: data.description,
        cost: Number.parseFloat(data.cost),
      },
    });
    return NextResponse.json(labTest);
  } catch (error) {
    console.error("Error creating lab test:", error);
    return NextResponse.json(
      { error: "Error creating lab test" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const data = await request.json();
  try {
    const labTest = await prisma.labTest.update({
      where: { test_name: data.test_name },
      data: {
        description: data.description,
        cost: Number.parseFloat(data.cost),
      },
    });
    return NextResponse.json(labTest);
  } catch (error) {
    console.error("Error updating lab test:", error);
    return NextResponse.json(
      { error: "Error updating lab test" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const test_name = searchParams.get("test_name");
  if (!test_name) {
    return NextResponse.json(
      { error: "Test name is required" },
      { status: 400 }
    );
  }
  try {
    await prisma.labTest.delete({
      where: { test_name },
    });
    return NextResponse.json({ message: "Lab test deleted successfully" });
  } catch (error) {
    console.error("Error deleting lab test:", error);
    return NextResponse.json(
      { error: "Error deleting lab test" },
      { status: 500 }
    );
  }
}
