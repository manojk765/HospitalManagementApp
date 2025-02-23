import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// DELETE request handler
export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const birth_id = url.pathname.split("/").pop(); // Extract the birth_id from the URL

        if (!birth_id) {
            return NextResponse.json({ error: 'Birth ID is missing' }, { status: 400 });
        }

        await prisma.birth.delete({
            where: {
                birth_id: birth_id,
            },
        });

        return NextResponse.json({ message: 'Birth record deleted successfully' });
    } catch (error) {
        return NextResponse.json(
            { error: `Failed to delete birth record ${error}` },
            { status: 500 }
        );
    }
}

// GET request handler
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const birth_id = url.pathname.split("/").pop(); // Extract the birth_id from the URL

        if (!birth_id) {
            return NextResponse.json({ error: 'Birth ID is missing' }, { status: 400 });
        }

        const birth = await prisma.birth.findUnique({
            where: {
                birth_id: birth_id
            }
        });

        if (!birth) {
            return NextResponse.json(
                { error: 'Birth record not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(birth);
    } catch (error) {
        console.error('Error fetching birth record:', error);
        return NextResponse.json(
            { error: 'Failed to fetch birth record' },
            { status: 500 }
        );
    }
}

// PUT request handler
export async function PUT(request: Request) {
    try {
        const url = new URL(request.url);
        const birth_id = url.pathname.split("/").pop(); // Extract the birth_id from the URL

        if (!birth_id) {
            return NextResponse.json({ error: 'Birth ID is missing' }, { status: 400 });
        }

        const body = await request.json();
        const birth = await prisma.birth.update({
            where: {
                birth_id: birth_id,
            },
            data: {
                patient_id: body.patient_id,
                name: body.name,
                fatherName: body.fatherName,
                gender: body.gender,
                date: new Date(body.date),
                typeofDelivery: body.typeofDelivery
            },
        });

        return NextResponse.json(birth);
    } catch (error) {
        return NextResponse.json(
            { error: `Failed to update birth record ${error}` },
            { status: 500 }
        );
    }
}
