// app/api/tickets/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const citaIdParam = request.nextUrl.searchParams.get("citaId");
  if (!citaIdParam) {
    return NextResponse.json({ error: "citaId no proporcionado" }, { status: 400 });
  }
  const citaId = parseInt(citaIdParam, 10);

  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        ticketCitas: {
          some: {
            id_cita: citaId
          }
        }
      },
      include: {
        paciente: { include: { usuario: true } },
        pagos: true,
        ticketCitas: {
          include: {
            cita: {
              include: {
                servicios: { include: { servicio: true } }
              }
            }
          }
        }
      }
    });

    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    console.error("Error al consultar tickets por citaId:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
