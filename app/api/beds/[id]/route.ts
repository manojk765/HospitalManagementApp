import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split("/").pop() 
    
    const data = await request.json()
    
    const bed = await prisma.beds.update({
      where: { id: parseInt(id || "0") }, 
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
      { error: `Failed to update bed ${error}` },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split("/").pop() 
    
    await prisma.beds.delete({
      where: { id: parseInt(id || "0") },
    })
    
    return NextResponse.json({ message: "Bed deleted successfully" })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete bed ${error}` },
      { status: 500 }
    )
  }
}
