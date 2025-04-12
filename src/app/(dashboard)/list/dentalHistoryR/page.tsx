import FormContainer from "@/components/formContainer"
import Pagination from "@/components/pagination"
import Table from "@/components/table"
import TableSearch from "@/components/tableSearch"
import prisma from "@/lib/prisma"
import { Empleado, Historia_Clinica, Paciente, Prisma, Usuario } from "@prisma/client"

type HistoryListR = Historia_Clinica & {
    paciente: Paciente & { usuario: Usuario },
    asignaciones: {
        empleado: Empleado & { usuario: Usuario }
    }[]
};

const columns = [
    {
        header: "Id", accessor: "id_historia"
    },
    {
        header: "Paciente", accessor: "paciente"
    },
    {
        header: "Fecha de última consulta", accessor: "fecha_creacion", className: "hidden md:table-cell"
    },
    {
        header: "Médico asignado", accessor: "doctor", className: "hidden md:table-cell"
    },
    {
        header: "Estado del tratamiento", accessor: "tratamientos", className: "hidden md:table-cell"
    },
    {
        header: "Fecha de alta", accessor: "fecha_alta", className: "hidden md:table-cell"
    },
    {
        header: "Acciones", accessor: "acciones"
    },
];

const renderRow = (item: HistoryListR) => (
    <tr key={item.id_historia} className="border-b border-gray-200 even:bg-backhoverbutton text-sm hover:bg-backgroundgray">
        <td className="hidden md:table-cell p-2">{item.id_historia}</td>
        <td className="flex items-center gap-4 p-2">
            <div className="flex flex-col">
                <h3 className="font-semibold">{`${item.paciente.usuario.nombre} ${item.paciente.usuario.apellido}`}</h3>
                <p className="text-xs text-gray-500">{item.paciente.usuario.dni}</p>
            </div>
        </td>
        <td className="table-cell">
            {item.fecha_ultima_consulta
                ? new Date(item.fecha_ultima_consulta).toLocaleDateString("es-PE", { timeZone: "UTC" })
                : ""}
        </td>
        <td className="hidden md:table-cell">
            {item.asignaciones && item.asignaciones.length > 0
                ? item.asignaciones
                    .map((a) => {
                        const u = a.empleado?.usuario;
                        return u ? `${u.nombre} ${u.apellido}` : null;
                    })
                    .filter(Boolean)
                    .join(", ")
                : "Sin asignaciones"}
        </td>
        <td className="hidden md:table-cell p-2">{item.estado_tratamiento}</td>
        <td className="table-cell">
            {item.fecha_alta
                ? new Date(item.fecha_alta).toLocaleDateString("es-PE", { timeZone: "UTC" })
                : ""}
        </td>
        <td>
            <div className="flex items-center gap-2">
                {"recepcionista" === "recepcionista" && (
                    <>
                        <FormContainer table="servicio" type="update" data={item}
                        />
                        <FormContainer table="servicio" type="delete" id={item.id_historia} />
                    </>
                )}
            </div>
        </td>
    </tr >
);

const HistoryListRPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
    const params = await searchParams;
    const { page = "1", sort, column, search } = params;
    const p = parseInt(page, 10);
    const take = 10;

    const where: Prisma.Historia_ClinicaWhereInput = {
        deletedAt: null,
        ...(search && {
            OR: [
                { paciente: { usuario: { nombre: { contains: search, mode: "insensitive" } } } },
                { paciente: { usuario: { apellido: { contains: search, mode: "insensitive" } } } },
                { paciente: { usuario: { dni: { contains: search, mode: "insensitive" } } } },
                { asignaciones: { some: { empleado: { usuario: { nombre: { contains: search, mode: "insensitive" } } } } } },
                { asignaciones: { some: { empleado: { usuario: { apellido: { contains: search, mode: "insensitive" } } } } } },
                { estado_tratamiento: { contains: search, mode: "insensitive" } },
            ],
        }),
    };

    const orderBy: Prisma.Historia_ClinicaOrderByWithRelationInput = column && (sort === "asc" || sort === "desc")
        ? { [column]: sort }
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
                paciente: {
                    select: { usuario: { select: { nombre: true, apellido: true } } },
                },
                asignaciones: {
                    where: { fecha_retiro: null },
                    select: {
                        empleado: {
                            select: { usuario: { select: { nombre: true, apellido: true } } },
                        },
                    },
                    take: 1,
                },
            },
        }),
        prisma.historia_Clinica.count({ where }),
    ]);

    return (
        <div>
            <div className=' rounded-md flex-1 m-4 mt-0'>
                <div className="flex items-center justify-between p-2">
                    <h1 className="hidden md:block text-lg font-semibold">Gestión de historias clínicas</h1>
                </div>
            </div>

            {/* BUSQUEDA Y AGREGAR CITA */}
            <div className='bg-backgrounddefault p-4 rounded-md flex-1 m-4 mt-0'>
                <div className='flex items-center justify-between'>
                    <h2 className="hidden md:block text-ls font-semibold">Historias clínicas</h2>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            {/*<FormContainer table="historiaClinica" type="create" />*/}
                        </div>
                    </div>
                </div>
                {/* TABLA */}
                <Table columns={columns} renderRow={renderRow} data={data} />

                {/*PAGINACION*/}
                <Pagination page={p} count={count} />
            </div>
        </div>
    )
}

export default HistoryListRPage