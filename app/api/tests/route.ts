import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"


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

export async function POST(req: Request) {
  const body = await req.json()
  const { test_name, description, cost } = body

  try {
    const newTest = await prisma.labTest.create({
      data: {
        test_name,
        description,
        cost,
      },
    })
    return NextResponse.json(newTest, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lab test" }, { status: 500 })
  }
}
