"use server"

import { PatientSchema } from "../lib/formSchema"
import prisma from "../lib/prisma";

type CurrentState = { success: boolean; error: string | null }

const formatFechaNacimiento = (fecha: Date) => {
    return new Date(
        new Date(fecha).toLocaleString("sv-SE", { timeZone: "America/Lima" })
    );
};

export const createPatient = async (
    currentState: CurrentState,
    data: PatientSchema
) => {
    try {
        const fechaNacimientoPeru = data.fecha_nacimiento
            ? formatFechaNacimiento(data.fecha_nacimiento)
            : null;

        console.log("Fecha de nacimiento formateada:", fechaNacimientoPeru);

        await prisma.paciente.create({
            data: {
                usuario: {
                    create: {
                        nombre: data.nombre,
                        apellido: data.apellido,
                        dni: data.dni,
                        sexo: data.sexo,
                        telefono: data.telefono,
                        password: data.password || "123456789",
                    },
                },
                // Fecha formateada
                fecha_nacimiento: fechaNacimientoPeru!,
            },
        });
        return { success: true, error: null };
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.stack);
        } else {
            console.error("Se produjo un error desconocido:", err);
        }
        return { success: false, error: "Error al crear un paciente" };
    }
};

export const updatePatient = async (
    currentState: CurrentState,
    data: PatientSchema
) => {
    try {
        await prisma.paciente.update({
            where: {
                id_paciente: data.id_paciente,
            },
            data: {
                usuario: {
                    update: {
                        nombre: data.nombre,
                        apellido: data.apellido,
                        dni: data.dni,
                        sexo: data.sexo,
                        telefono: data.telefono,
                        password: data.password || "123456789",
                    },
                },
                fecha_nacimiento: data.fecha_nacimiento
                    ? formatFechaNacimiento(data.fecha_nacimiento)
                    : undefined,
            },
        });
        return { success: true, error: null };
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.stack);
        } else {
            console.error("Se produjo un error desconocido:", err);
        }
        return { success: false, error: "Error al actualizar un paciente" };
    }
};

export const deletePatient = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    const patientId = parseInt(id, 10);
    if (isNaN(patientId)) {
        throw new Error("ID de paciente inválido");
    }
    try {
        await prisma.$transaction(async (tx) => {
            const pacienteEliminado = await tx.paciente.update({
                where: { id_paciente: patientId },
                data: { deletedAt: new Date() },
            });
            await tx.usuario.update({
                where: { id_usuario: pacienteEliminado.id_usuario },
                data: { deletedAt: new Date() },
            });
        });
        return { success: true, error: null };
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.stack);
        } else {
            console.error("Se produjo un error desconocido:", err);
        }
        return { success: false, error: "Error al eliminar un paciente" };
    }
};
