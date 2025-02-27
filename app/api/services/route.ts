import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.services.findMany({
      select: {
        service_name: true,
        cost: true,
        description: true
      }, 
      orderBy: {
        service_name: 'asc'
      }
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const data = await request.json();
  try {
    const service = await prisma.services.create({
      data: {
        service_name: data.service_name,
        description: data.description,
        cost: Number.parseFloat(data.cost),
      },
    });
    return NextResponse.json(service);
  } catch (error) {
    console.error("Error creating service:", error);  // Log the error
    return NextResponse.json({ error: "Error creating service" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const data = await request.json();
  try {
    const service = await prisma.services.update({  
      where: { service_name: decodeURIComponent(data.service_name) }, 
      data: {
        description: data.description,
        cost: Number.parseFloat(data.cost),
      },
    });
    return NextResponse.json(service);
  } catch (error) {
    console.error("Error updating service:", error); // Log the actual error
    return NextResponse.json({ error: "Error updating service" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const service_name = searchParams.get("service_name");
  if (!service_name) {
    return NextResponse.json({ error: "Service name is required" }, { status: 400 });
  }
  try {
    await prisma.services.delete({
      where: { service_name },
    });
    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);  // Log the error
    return NextResponse.json({ error: "Error deleting service" }, { status: 500 });
  }
}
