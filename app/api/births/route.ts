import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const births = await prisma.birth.findMany({
            select: {
                birth_id: true,
                patient_id: true,
                name: true,
                gender: true,
                fatherName: true,
                date: true,
                typeofDelivery: true
            },
            orderBy: {
                patient_id: 'desc'
            }
        });

        return NextResponse.json(births, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error("Error fetching births:", error);
        return NextResponse.json(
            { error: "Failed to fetch births" },
            { status: 500 }
        );
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yy = String(today.getFullYear()).slice(-2);
        
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        
        const birthCount = await prisma.birth.count({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });
        
        const sequenceNumber = String(birthCount + 1).padStart(5, '0');
        const birth_id = `B${dd}${mm}${yy}${sequenceNumber}`;
        
        const birth = await prisma.birth.create({
            data: {
                birth_id,
                patient_id: body.patient_id,
                name: body.name,
                fatherName: body.fatherName,
                gender: body.gender,
                date: new Date(body.date),
                typeofDelivery: body.typeofDelivery
            }
        });
        
        return NextResponse.json(birth);
    } catch (error) {
        console.log(`Error is: ${error}`)
        return NextResponse.json(
            { error: "Failed to create birth" },
            { status: 500 }
        );
    }
}

