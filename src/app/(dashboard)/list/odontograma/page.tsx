import { authOptions } from '@/lib/auth';
import AppointmentCard, { getCurrentDatePeru } from "@/components/appointmentCard";
import TableSearch from "@/components/tableSearch";
import prisma from "@/lib/prisma";
import { numPage } from "@/lib/settings";
import {Prisma, Usuario } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { SymmetricSelectRow } from '@/components/toothSelect';
import LegendGrid from '@/components/toothGrid';
import ToothOverlay from '@/components/toothOverlay';
import ClientOdontograma from '@/components/odontogramaClient';

const OdontogramaPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
    const params = await searchParams;
    const { page, sort, column, start, end, ...queryParams } = params;
    const p = page ? parseInt(page) : 1;
    const query: Prisma.CitaWhereInput = { deletedAt: null };
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error("No hay sesión activa.");
    }

    let empleadoId: number | null = null;
    if (session.user.role === "ODONTOLOGO") {
        const empleado = await prisma.empleado.findFirst({
            where: { id_usuario: parseInt(session.user.id) },
            select: { id_empleado: true },
        });
        empleadoId = empleado?.id_empleado || null;
        if (empleadoId) {
            query.empleado = { id_empleado: empleadoId };
        }
    }

    return (
    <div>
        <div className="flex flex-col md:flex-row">
            <div className="flex-1">
                <div className="bg-backgrounddefault p-4 rounded-md flex-1 m-4 mt-0">
                    <div className="flex items-center justify-between">
                    <h2 className="hidden md:block text-ls font-semibold">Odontograma</h2>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        {/* <TableSearch /> */}
                    </div>
                </div>

                 <ClientOdontograma />
                 </div>
            </div>
            
        </div>
    </div>

    );
}

export default OdontogramaPage;
