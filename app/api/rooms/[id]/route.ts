import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request: Request) {
  try {
    const pathname = new URL(request.url).pathname;
    const id = pathname.split('/').pop(); 

    const { available } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing room id in URL' }, { status: 400 });
    }

    const updatedRoom = await prisma.beds.update({
      where: { id: Number(id) },
      data: { available },
    });

    return NextResponse.json(updatedRoom, { status: 200 });
  } catch (error) {
    console.error('Error updating room:', error);
    return NextResponse.json({ error: 'Unable to update room' }, { status: 500 });
  }
}
