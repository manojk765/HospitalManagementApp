import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {   
    try {
        const rooms = await prisma.beds.findMany({
        select: {
            id: true,
            type: true,
            bedNumber: true,
            dailyRate : true,
            available: true,
        },
        orderBy: { id: "desc" },
        }); 
    
        return NextResponse.json(rooms);
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return NextResponse.json(
        { error: "Failed to fetch rooms" },
        { status: 500 }
        );
    }
}