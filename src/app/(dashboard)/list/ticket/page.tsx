import FormContainer from "@/components/formContainer"
import Pagination from "@/components/pagination"
import PrintButton from "@/components/printerButton"
import PrinterButton from "@/components/printerButton"
import Table from "@/components/table"
import TableSearch from "@/components/tableSearch"
import prisma from "@/lib/prisma"
import { numPage } from "@/lib/settings"
import { Cita, Paciente, Pago, Prisma, Ticket, Usuario } from "@prisma/client"

type TicketList = Ticket & { paciente: Paciente & { usuario: Usuario }, pagos: Pago[] }

const columns = [
    {
        header: "Id", accessor: "idTicket", className: "hidden md:table-cell"
    },
    {
        header: "Fecha", accessor: "fechaEmision", className: "hidden md:table-cell"
    },
    {
        header: "Paciente", accessor: "paciente", className: "hidden md:table-cell"
    },
    {
        header: "Monto", accessor: "montoTotal", className: "hidden md:table-cell"
    },
    {
        header: "Tipo de comprobante", accessor: "tipoComprobante"
    },
    {
        header: "Medio de pago", accessor: "medioPago"
    },
    {
        header: "Acciones", accessor: "acciones"
    },
];

const renderRow = (item: TicketList) => (
    <tr key={item.id_ticket} className="border-b border-gray-200 even:bg-backgroundgray text-sm hover:bg-backhoverbutton">
        <td className="hidden md:table-cell p-2">{item.id_ticket}</td>
        <td className="table-cell">
            {item.fecha_emision
                ? new Date(item.fecha_emision).toLocaleDateString("es-PE", { timeZone: "UTC" })
                : ""}
        </td>
        <td className="flex items-center gap-4 p-2">
            <div className="flex flex-col">
                <h3 className="font-semibold">
                    {`${item.paciente.usuario.nombre} ${item.paciente.usuario.apellido}`}
                </h3>
                <p className="text-xs text-gray-500">{item.paciente.usuario.dni}</p>
            </div>
        </td>
        <td className="hidden md:table-cell">{item.monto_total}</td>
        <td className="hidden md:table-cell">{item.tipo_comprobante}</td>
        <td className="hidden md:table-cell">{item.medio_pago}</td>
        <td>
            <div className="flex items-center gap-2">
                <PrintButton ticketId={item.id_ticket} />
                {"recepcionista" === "recepcionista" && (
                    <>
                        <FormContainer table="boleta" type="update" data={item} />
                        <FormContainer table="boleta" type="delete" id={item.id_ticket} />
                    </>
                )}
            </div>
        </td>
    </tr>
);


const PatientListPage = async ({
    searchParams
}: {
    searchParams: { [key: string]: string | undefined }
}) => {
    const params = await searchParams;
    const { page, ...queryParams } = params;

    const p = page ? parseInt(page) : 1;

    const query: Prisma.TicketWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "id_ticket":
                        query.id_ticket = parseInt(value);
                        break;
                    case "search":
                        query.OR = [
                            { paciente: { usuario: { nombre: { contains: value, mode: "insensitive" } }, }, },
                            { paciente: { usuario: { apellido: { contains: value, mode: "insensitive" } }, }, },
                            { paciente: { usuario: { dni: { contains: value, mode: "insensitive" } }, }, },
                            { id_ticket: isNaN(parseInt(value)) ? undefined : parseInt(value), },
                        ];
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.ticket.findMany({
            where: query,
            include: {
                paciente: { include: { usuario: true } },
                pagos: true,
            },
            take: numPage,
            skip: numPage * (p - 1),
        }),
        prisma.ticket.count({ where: query }),
    ]);

    return (
        <div>
            <div className=' rounded-md flex-1 m-4 mt-0'>
                <div className="flex items-center justify-between p-2">
                    <h1 className="hidden md:block text-lg font-semibold">Gestión de Boletas</h1>
                </div>
            </div>

            {/* BUSQUEDA Y AGREGAR CITA */}
            <div className='bg-backgrounddefault p-4 rounded-md flex-1 m-4 mt-0'>
                <div className='flex items-center justify-between'>
                    <h2 className="hidden md:block text-ls font-semibold">Boletas</h2>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <FormContainer table="boleta" type="create" />
                        </div>
                    </div>
                </div>
                {/*LISTA*/}
                <Table columns={columns} renderRow={renderRow} data={data} />

                {/*PAGINACION*/}
                <Pagination page={p} count={count} />
            </div>
        </div>
    )
}

export default PatientListPage