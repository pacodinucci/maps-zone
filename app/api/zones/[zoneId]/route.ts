import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { zoneId: string } }
) {
  try {
    const { zoneId } = params;

    if (zoneId) {
      return new NextResponse("ID is required", { status: 400 });
    }

    // Buscar si la zona existe
    const zone = await db.zone.findUnique({ where: { id: zoneId } });
    if (!zone) {
      return NextResponse.json(
        { error: "Zona no encontrada." },
        { status: 404 }
      );
    }

    // Eliminar la zona
    await db.zone.delete({ where: { id: zoneId } });

    return NextResponse.json(
      { message: "Zona eliminada correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar la zona:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al eliminar la zona." },
      { status: 500 }
    );
  }
}
