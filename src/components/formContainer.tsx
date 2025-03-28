import prisma from "@/lib/prisma";
import FormModal from "./formModal";

export type FormContainerProps = {
    table: "cita" | "paciente" | "empleado" | "boleta" | "servicio" | "doctor";
    type: "create" | "update" | "delete" | "view";
    data?: any;
    id?: number | string;
    //where?: any;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
    let relatedData = {};

    if (type !== "delete") {
        switch (table) {
            case "cita":
                const appointmentPatient = await prisma.paciente.findMany({
                    where: {
                        deletedAt: null,
                        usuario: { deletedAt: null },
                    },
                    select: {
                        id_paciente: true,
                        usuario: {
                            select: {
                                nombre: true,
                                apellido: true,
                            },
                        },
                        citas: {
                            where: { deletedAt: null },
                            select: {
                                id_cita: true,
                                deuda_restante: true,
                                servicios: {
                                    select: {
                                        cantidad: true,
                                        servicio: {
                                            select: {
                                                tarifa: true,
                                            },
                                        },
                                    },
                                },
                                ticketCitas: {
                                    select: {
                                        ticket: {
                                            select: {
                                                pagos: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });

                const appointmentDoctor = await prisma.empleado.findMany({
                    where: {
                        deletedAt: null,
                        usuario: {
                            deletedAt: null,
                            roles: {
                                some: {
                                    rol: { nombre: "ODONTOLOGO" },
                                },
                            },
                        },
                    },
                    select: {
                        id_empleado: true,
                        usuario: {
                            select: {
                                nombre: true,
                                apellido: true,
                            },
                        },
                    },
                });

                const appointmentService = await prisma.servicio.findMany({
                    where: { deletedAt: null },
                    select: {
                        id_servicio: true,
                        nombre_servicio: true,
                        tarifa: true,
                    },
                });

                let selectedServices: {
                    id_servicio: number;
                    nombre_servicio: string;
                    tarifa: number;
                    cantidad: number;
                }[] = [];

                if ((type === "update" || type === "view") && data?.id_cita) {
                    const citaWithServices = await prisma.cita.findUnique({
                        where: { id_cita: data.id_cita },
                        include: {
                            servicios: {
                                include: {
                                    servicio: {
                                        select: {
                                            id_servicio: true,
                                            nombre_servicio: true,
                                            tarifa: true,
                                        },
                                    },
                                },
                            },
                        },
                    });

                    selectedServices =
                        citaWithServices?.servicios.map((sc) => ({
                            id_servicio: sc.servicio.id_servicio,
                            nombre_servicio: sc.servicio.nombre_servicio,
                            tarifa: sc.servicio.tarifa,
                            cantidad: sc.cantidad,
                        })) || [];
                }

                relatedData = {
                    pacientes: appointmentPatient.map((p) => ({
                        id_paciente: p.id_paciente,
                        nombre: p.usuario.nombre,
                        apellido: p.usuario.apellido,
                        citas: p.citas,
                    })),
                    empleados: appointmentDoctor.map((d) => ({
                        id_empleado: d.id_empleado,
                        nombre: d.usuario.nombre,
                        apellido: d.usuario.apellido,
                    })),
                    servicios: appointmentService.map((s) => ({
                        id_servicio: s.id_servicio,
                        nombre_servicio: s.nombre_servicio,
                        tarifa: s.tarifa,
                    })),
                    selectedServices,
                };

                //console.log(relatedData);
                break;
            case "paciente":
                const userPatients = await prisma.usuario.findMany({
                    where: { paciente: { isNot: null } },
                    select: {
                        id_usuario: true,
                        nombre: true,
                        apellido: true,
                    },
                });
                relatedData = {
                    usuarios: userPatients.map((u) => ({
                        id_usuario: u.id_usuario,
                        nombre: `${u.nombre} ${u.apellido}`,
                    })),
                };
                break;
            case "empleado":
                const userEmployees = await prisma.usuario.findMany({
                    where: { empleado: { isNot: null } },
                    select: {
                        id_usuario: true,
                        nombre: true,
                        apellido: true,
                    },
                });
                relatedData = {
                    usuarios: userEmployees.map((u) => ({
                        id: u.id_usuario,
                        nombre: `${u.nombre} ${u.apellido}`,
                    })),
                };
                break;
            case "boleta":
                const patients = await prisma.paciente.findMany({
                    where: { deletedAt: null },
                    select: {
                        id_paciente: true,
                        usuario: {
                            select: { nombre: true, apellido: true },
                        },
                        citas: {
                            where: { deletedAt: null },
                            select: {
                                id_cita: true,
                                fecha_cita: true,
                                estado: true,
                                monto_pagado: true,
                                deuda_restante: true,
                                servicios: {
                                    select: {
                                        servicio: {
                                            select: {
                                                id_servicio: true,
                                                nombre_servicio: true,
                                                tarifa: true,
                                            },
                                        },
                                        cantidad: true,
                                    },
                                },
                                ticketCitas: {
                                    where: { cita: { deletedAt: null } },
                                    select: {
                                        ticket: {
                                            select: {
                                                pagos: {
                                                    select: {
                                                        id_pago: true,
                                                        monto: true,
                                                        fecha_pago: true,
                                                        medio_pago: true,
                                                        estado_pago: true, // (PENDIENTE, COMPLETADO, FRACCIONADO)
                                                    },
                                                },
                                                monto_pagado: true,
                                                deuda_restante: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });

                const tickets = await prisma.ticket.findMany({
                    where: { deletedAt: null },
                    select: {
                        id_ticket: true,
                        fecha_emision: true,
                        tipo_comprobante: true,
                        medio_pago: true,
                        monto_total: true,
                        monto_pagado: true,
                        deuda_restante: true,
                        paciente: {
                            select: {
                                id_paciente: true,
                                usuario: { select: { nombre: true, apellido: true } },
                                citas: {
                                    where: { deletedAt: null },
                                    select: {
                                        id_cita: true,
                                        fecha_cita: true,
                                        estado: true,
                                        monto_pagado: true,
                                        deuda_restante: true,
                                        servicios: {
                                            select: {
                                                servicio: {
                                                    select: {
                                                        id_servicio: true,
                                                        nombre_servicio: true,
                                                        tarifa: true,
                                                    },
                                                },
                                                cantidad: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        pagos: {
                            select: {
                                id_pago: true,
                                monto: true,
                                fecha_pago: true,
                                medio_pago: true,
                                estado_pago: true,
                            },
                        },
                        ticketCitas: {
                            where: { cita: { deletedAt: null } },
                            select: {
                                cita: {
                                    select: {
                                        id_cita: true,
                                        fecha_cita: true,
                                        estado: true,
                                        monto_pagado: true,
                                        deuda_restante: true,
                                        servicios: {
                                            select: {
                                                servicio: {
                                                    select: {
                                                        id_servicio: true,
                                                        nombre_servicio: true,
                                                        tarifa: true,
                                                    },
                                                },
                                                cantidad: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });

                const mapServicios = (servicios: any[]) =>
                    servicios.map((s) => ({
                        id_servicio: s.servicio.id_servicio,
                        nombre_servicio: s.servicio.nombre_servicio,
                        tarifa: s.servicio.tarifa,
                        cantidad: s.cantidad,
                    }));

                const mapCitas = (citas: any[]) =>
                    citas.map((c) => ({
                        id_cita: c.id_cita,
                        fecha_cita: c.fecha_cita,
                        estado: c.estado,
                        monto_pagado: c.monto_pagado,
                        deuda_restante: c.deuda_restante,
                        servicios: mapServicios(c.servicios),
                        ticketCitas: c.ticketCitas,
                    }));

                relatedData = {
                    tickets: tickets.map((t) => ({
                        id_ticket: t.id_ticket,
                        fecha_emision: t.fecha_emision,
                        tipo_comprobante: t.tipo_comprobante,
                        medio_pago: t.medio_pago,
                        monto_total: t.monto_total,
                        monto_pagado: t.monto_pagado,
                        deuda_restante: t.deuda_restante,
                        paciente: {
                            id_paciente: t.paciente.id_paciente,
                            nombre: t.paciente.usuario.nombre,
                            apellido: t.paciente.usuario.apellido,
                        },
                        pagos: t.pagos,
                        citas: t.ticketCitas.map((tc) => ({
                            id_cita: tc.cita.id_cita,
                            fecha_cita: tc.cita.fecha_cita,
                            estado: tc.cita.estado,
                            monto_pagado: tc.cita.monto_pagado,
                            deuda_restante: tc.cita.deuda_restante,
                            servicios: mapServicios(tc.cita.servicios),
                        })),
                    })),
                    pacientes: patients.map((p) => ({
                        id_paciente: p.id_paciente,
                        nombre: p.usuario.nombre,
                        apellido: p.usuario.apellido,
                        citas: mapCitas(p.citas),
                    })),
                };

                break;

            case "doctor": {
                const doctors = await prisma.empleado.findMany({
                    where: {
                        usuario: {
                            roles: {
                                some: {
                                    rol: { nombre: "ODONTOLOGO" },
                                },
                            },
                        },
                    },
                    select: {
                        id_empleado: true,
                        usuario: {
                            select: {
                                nombre: true,
                                apellido: true,
                            },
                        },
                    },
                });
                relatedData = {
                    doctores: doctors.map((d) => ({
                        id_empleado: d.id_empleado,
                        nombre: `${d.usuario.nombre} ${d.usuario.apellido}`,
                    })),
                }
                break
            }
            default:
                break;

        }
    }

    return (
        <div>
            <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
        </div>
    );
};

export default FormContainer;