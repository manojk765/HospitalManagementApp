import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const tests = await prisma.patientTests.findMany({
            where: { patient_id: params.id },
            orderBy: [
                { test_date: "desc" },
                { test_name: "asc" }
            ]
        });
        
        return NextResponse.json(tests);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch tests" },
            { status: 500 }
        );
    }
}
