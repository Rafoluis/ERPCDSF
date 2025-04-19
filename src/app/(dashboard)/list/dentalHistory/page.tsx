import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import Table from "@/components/table";
import TableSearch from "@/components/tableSearch";
import Pagination from "@/components/pagination";
import FormContainer from "@/components/formContainer";
import { Prisma } from "@prisma/client";
import Link from "next/link"
import { Plus } from "lucide-react";

type HistoryRow = {
    id_historia: number;
    fecha_ultima_consulta: Date | null;
    estado_tratamiento: string | null;
    fecha_alta: Date | null;
    paciente: { usuario: { nombre: string; apellido: string; dni: string } };
    odontologoAsignado: { nombre: string; apellido: string } | null;
};

export default async function DentalHistoryPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("No hay sesión activa.");

    const role = session.user.role;
    const isOdontologo = role === "ODONTOLOGO";
    const isAdmin = role === "ADMIN";
    let empleadoId: number | null = null;

    if (isOdontologo) {
        const emp = await prisma.empleado.findFirst({
            where: { id_usuario: parseInt(session.user.id) },
            select: { id_empleado: true },
        });
        empleadoId = emp?.id_empleado || null;
    }

    const { page = "1", sort, column, search } = await searchParams;
    const p = parseInt(page, 10);
    const take = 10;

    const where: Prisma.Historia_ClinicaWhereInput = {
        deletedAt: null,
        ...(empleadoId && {
            asignaciones: { some: { empleado: { id_empleado: empleadoId }, fecha_retiro: null } },
        }),
        ...(search && {
            OR: [
                { paciente: { usuario: { nombre: { contains: search, mode: "insensitive" } } } },
                { paciente: { usuario: { apellido: { contains: search, mode: "insensitive" } } } },
                { paciente: { usuario: { dni: { contains: search, mode: "insensitive" } } } },
                { estado_tratamiento: { contains: search, mode: "insensitive" } },
                { asignaciones: { some: { empleado: { usuario: { nombre: { contains: search, mode: "insensitive" } } } } } },
                { asignaciones: { some: { empleado: { usuario: { apellido: { contains: search, mode: "insensitive" } } } } } }
            ],
        }),
    };

    const validSort = sort === "asc" || sort === "desc" ? sort : "desc";
    const orderBy: Prisma.Historia_ClinicaOrderByWithRelationInput = column
        ? { [column]: validSort }
        : { id_historia: "desc" };

    const [data, count] = await prisma.$transaction([
        prisma.historia_Clinica.findMany({
            where,
            orderBy,
            take,
            skip: take * (p - 1),
            select: {
                id_historia: true,
                fecha_ultima_consulta: true,
                estado_tratamiento: true,
                fecha_alta: true,
                paciente: { select: { usuario: { select: { nombre: true, apellido: true, dni: true } } } },
                asignaciones: {
                    where: { fecha_retiro: null },
                    select: { empleado: { select: { usuario: { select: { nombre: true, apellido: true } } } } },
                    take: 1,
                },
            },
        }),
        prisma.historia_Clinica.count({ where }),
    ]);

    const formatted: HistoryRow[] = data.map((h) => ({
        ...h,
        odontologoAsignado: h.asignaciones[0]?.empleado.usuario || null,
    }));

    const baseColumns = [
        { header: "Id", accessor: "id_historia" },
        { header: "Paciente", accessor: "paciente" },
        { header: "Fecha última consulta", accessor: "fecha_ultima_consulta", className: "hidden md:table-cell" },
    ];

    const roleColumns = isOdontologo
        ? [{ header: "Estado tratamiento", accessor: "estado_tratamiento", className: "hidden md:table-cell" }]
        : [{ header: "Médico asignado", accessor: "odontologoAsignado", className: "hidden md:table-cell" }];

    const commonColumns = [
        { header: "Fecha de alta", accessor: "fecha_alta", className: "hidden md:table-cell" },
        { header: "Acciones", accessor: "acciones" },
    ];

    const columns = [...baseColumns, ...roleColumns, ...commonColumns];

    // ROL
    const renderActions = (item: HistoryRow) => {
        const canModify = isOdontologo || isAdmin;
        return (
            <div className="flex items-center gap-2">
                {canModify && <FormContainer table="servicio" type="update" data={item} />}
                {canModify && <FormContainer table="servicio" type="delete" id={item.id_historia} />}
            </div>
        );
    };

    const renderRow = (item: HistoryRow) => (
        <tr key={item.id_historia} className="border-b even:bg-backhoverbutton text-sm hover:bg-backgroundgray">
            <td className="hidden md:table-cell p-2">{item.id_historia}</td>
            <td className="flex items-center gap-4 p-2">
                <div className="flex flex-col">
                    <h3 className="font-semibold">
                        {`${item.paciente.usuario.nombre} ${item.paciente.usuario.apellido}`}
                    </h3>
                    <p className="text-xs text-gray-500">{item.paciente.usuario.dni}</p>
                </div>
            </td>
            <td className="table-cell p-2">
                {item.fecha_ultima_consulta
                    ? new Date(item.fecha_ultima_consulta).toLocaleDateString("es-PE", { timeZone: "UTC" })
                    : ""}
            </td>
            {isOdontologo ? (
                <td className="hidden md:table-cell p-2">{item.estado_tratamiento}</td>
            ) : (
                <td className="hidden md:table-cell p-2">
                    {item.odontologoAsignado
                        ? `${item.odontologoAsignado.nombre} ${item.odontologoAsignado.apellido}`
                        : "Sin asignar"}
                </td>
            )}
            <td className="hidden md:table-cell p-2">
                {item.fecha_alta
                    ? new Date(item.fecha_alta).toLocaleDateString("es-PE", { timeZone: "UTC" })
                    : ""}
            </td>
            <td className="p-2">{renderActions(item)}</td>
        </tr>
    );

    return (
        <div>
            <div className='rounded-md flex-1 m-4 mt-0'>
                <div className="flex items-center justify-between p-2">
                    <h1 className="hidden md:block text-lg font-semibold">Gestión de historias clínicas</h1>
                </div>
            </div>

            <div className='bg-backgrounddefault p-4 rounded-md flex-1 m-4 mt-0'>
                <div className='flex items-center justify-between'>
                    <h2 className="hidden md:block text-ls font-semibold">Historias clínicas</h2>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        {(isOdontologo || isAdmin) && (
                            <Link href="/list/dentalHistory/new">
                                <button type="button" className="w-auto px-4 py-2 rounded-full bg-backbuttondefault flex items-center justify-center">
                                    <Plus size={20} color="white" />
                                    <span className="ml-2 text-sm font-medium text-textdefault">Nueva historia</span>
                                </button>
                            </Link>
                        )}
                    </div>
                </div>

                <Table columns={columns} renderRow={renderRow} data={formatted} />
                <Pagination page={p} count={count} />
            </div>
        </div>
    );
}
