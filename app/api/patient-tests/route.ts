import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const tests = await prisma.labTest.findMany({
      select: {
        test_name: true,
        cost: true,
        description: true
      },
      orderBy: {
        test_name: 'asc'
      } 
    });

    return NextResponse.json(tests);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}