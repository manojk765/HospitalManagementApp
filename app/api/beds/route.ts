import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"


export async function GET() {
  try {
    const beds = await prisma.beds.findMany({
      orderBy: {
        id: "asc",
      },
    })
    return NextResponse.json(beds)
  } catch (error) {
    console.error("Error fetching beds:", error)
    return NextResponse.json(
      { error: "Failed to fetch beds" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
    try {
      const data = await request.json()
      
      const bed = await prisma.beds.create({
        data: {
          type: data.type,
          bedNumber: data.bedNumber,
          dailyRate: data.dailyRate,
          available: data.available,
        },
      })
      
      return NextResponse.json(bed)
    } catch (error) {
      return NextResponse.json(
        { error: `Failed to create bed ${error}` },
        { status: 500 }
      )
    }
  }
  