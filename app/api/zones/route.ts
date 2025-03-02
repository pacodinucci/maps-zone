import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, coordinates } = body;

    if (
      !name ||
      !coordinates ||
      !Array.isArray(coordinates) ||
      coordinates.length < 3
    ) {
      return NextResponse.json(
        { error: "El nombre y al menos 3 coordenadas son requeridos." },
        { status: 400 }
      );
    }

    const newZone = await db.zone.create({
      data: {
        name,
        coordinates: JSON.stringify(coordinates), // Guardamos las coordenadas en formato JSON
      },
    });

    return NextResponse.json(
      { message: "Zona creada exitosamente", zone: newZone },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear la zona:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al crear la zona." },
      { status: 500 }
    );
  }
}

// ✅ Nuevo handler GET para obtener todas las zonas
export async function GET() {
  try {
    const zones = await db.zone.findMany();

    return NextResponse.json(
      {
        zones: zones.map((zone) => ({
          id: zone.id,
          name: zone.name,
          coordinates: zone.coordinates as { lat: number; lng: number }[], // Convertimos JsonValue a tipo esperado
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener las zonas:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al obtener las zonas." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const zoneId = searchParams.get("zoneId");

  if (!zoneId) {
    return new NextResponse("Zone Id is required", { status: 400 });
  }

  try {
    const zoneDeleted = await db.zone.delete({
      where: {
        id: zoneId,
      },
    });

    if (!zoneDeleted) {
      return new NextResponse("Zone couldn't be deleted", { status: 400 });
    }

    return new NextResponse("Zone deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting zone", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
