"use client"

import AppointmentCard from "@/app/components/appointmentCard"
import FormModal from "@/app/components/formModal"
import Pagination from "@/app/components/pagination"
import Table from "@/app/components/table"
import TableSearch from "@/app/components/tableSearch"
import { clientesData } from "@/lib/data"
import prisma from "@/lib/prisma"
import { numPage } from "@/lib/settings"
import { Cita, Empleado, Paciente, Prisma, Servicio } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from 'next/navigation';
import { useState } from "react"

type AppointmentList = Cita & { paciente: Paciente, empleado: Empleado, servicio: Servicio }

const columns = [
    {
        header: "Paciente", accessor: "paciente"
    },
    {
        header: "Fecha de cita", accessor: "fechaCita"
    },
    {
        header: "Hora de cita", accessor: "horaCita"
    },
    {
        header: "Doctor asignado", accessor: "doctorAsignado", className: "hidden md:table-cell"
    },
    {
        header: "Servicio", accessor: "servicio", className: "hidden md:table-cell"
    },
    {
        header: "Tarifa", accessor: "tarifa", className: "hidden md:table-cell"
    },
    {
        header: "Estado", accessor: "estado", className: "hidden md:table-cell"
    },
    {
        header: "Acciones", accessor: "acciones"
    },
];

export const renderRow = (item: AppointmentList) => (
    <tr key={item.id_cita} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-sky-50">
        <td className="flex items-center gap-4 p-2">
            <div className="flex flex-col">
                <h3 className="font-semibold">{`${item.paciente.nombre} ${item.paciente.apellido}`}</h3>
                <p className="text-xs text-gray-500">{item.paciente.dni}</p>
            </div>
        </td>
        <td className="table-cell">
            {new Intl.DateTimeFormat('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).format(item.fecha_cita)}</td>
        <td className="table-cell">
            {new Intl.DateTimeFormat('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            }).format(item.hora_cita_inicial)}
        </td>
        <td className="hidden md:table-cell">{`${item.empleado.nombre} ${item.empleado.apellido}`}</td>
        <td className="hidden md:table-cell">{item.servicio.nombre_servicio}</td>
        <td className="hidden md:table-cell">{item.servicio.tarifa}</td>
        <td className="hidden md:table-cell">{item.estado}</td>
        <td>
            <div className="flex items-center gap-2">
                <Link href={'/list/clientes/${item.id}'}>
                    <FormModal table="cita" type="view" />
                </Link>
                {"recepcionista" === "recepcionista" && (
                    <>
                        <FormModal table="cita" type="update" data={{
                            id: 3,
                            paciente: "Maria Perez",
                            fecha: "2015-01-01",
                            horaInicio: "20:00",
                            horaFinal: "21:00",
                            servicio: "Limpieza dental",
                            tarifaServicio: "20",
                            doctorAsignado: "Pedro Paramo",
                            descripcion: "Pago al contado",
                        }}
                        />
                        <FormModal table="cita" type="delete" id={item.id_cita} />
                    </>
                )}
            </div>
        </td>
    </tr>
);

const AppointmentListPage = ({ searchParams, }: { searchParams: { [key: string]: string | undefined } }) => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);

    // const params = await searchParams;

    // const { page, ...queryParams } = params;

    // const p = page ? parseInt(page) : 1;

    // const [data, count] = await prisma.$transaction([
    //     prisma.cita.findMany({
    //         include: {
    //             paciente: true,
    //             empleado: true,
    //             servicio: true,
    //         },
    //         take: numPage,
    //         skip: numPage * (p - 1),
    //     }),
    //     prisma.cita.count(),
    // ]);

    //console.log("searchParams:", params)
    //console.log(data);
    //console.log(count);

    return (
        <div className=''>
            {/* CARTAS CITAS */}
            <div className=''>
                <div className="flex items-center justify-between p-4">
                    <h1 className="hidden md:block text-lg font-semibold">Gestión de citas</h1>
                </div>

                <div className='flex gap-4 justify-between flex-wrap'>
                    <AppointmentCard type='Citas totales' />
                    <AppointmentCard type='Pacientes totales' />
                    <AppointmentCard type='Próximas citas' />
                </div>
            </div>
            {/* BUSQUEDA Y AGREGAR CITA */}
            <div className='p-4 rounded-md flex-1 m-4 mt-0'>
                <div className='flex items-center justify-between'>
                    <h2 className="hidden md:block text-ls font-semibold">Citas</h2>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <FormModal table="cita" type="create" />
                        </div>
                    </div>
                </div>
                {/*LISTA*/}
                <Table columns={columns} renderRow={renderRow} data={data} />
            </div>
            {/*PAGINACION*/}
            {/* <Pagination page={p} count={count} /> */}
        </div>
    )
}

export default AppointmentListPage