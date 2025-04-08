import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const empresa = await prisma.empresa.findFirst({
            where: { deletedAt: null },
            orderBy: { razon_social: 'asc' },
        });
        if (!empresa) {
            return NextResponse.json({ success: false, error: 'No se encontró empresa' });
        }
        return NextResponse.json({ success: true, data: [empresa] });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: 'Error al obtener la empresa' });
    }
}
