"use server";

import { EmpresaSchema } from "@/schemas/company.schema";
import prisma from "../lib/prisma";

type CurrentState = { success: boolean; error: string | null };

type GetEmpresaResponse = {
    success: boolean;
    data?: {
        id_empresa: number;
        ruc: string;
        razon_social: string;
        nombre_comercial: string;
        domicilio_fiscal: string;
        ubigeo: string;
        actividad_economica: string;
        tipo_contribuyente: string;
        clave_sol: string;
        telefono: string;
        email: string;
        fecha_creacion: Date;
    }[];
    error: string | null;
};

export const getEmpresa = async (): Promise<GetEmpresaResponse> => {
    try {
        const empresasRaw = await prisma.empresa.findFirst({
            where: { deletedAt: null },
            orderBy: { razon_social: "asc" },
        });

        if (!empresasRaw) {
            return { success: false, error: "No se encontraron empresas" };
        }

        const empresa = {
            id_empresa: empresasRaw.id_empresa,
            ruc: empresasRaw.ruc,
            razon_social: empresasRaw.razon_social,
            nombre_comercial: empresasRaw.nombre_comercial ?? "",
            domicilio_fiscal: empresasRaw.domicilio_fiscal ?? "",
            ubigeo: empresasRaw.ubigeo ?? "",
            actividad_economica: empresasRaw.actividad_economica ?? "",
            tipo_contribuyente: empresasRaw.tipo_contribuyente ?? "",
            clave_sol: empresasRaw.clave_sol ?? "",
            telefono: empresasRaw.telefono ?? "",
            email: empresasRaw.email ?? "",
            fecha_creacion: empresasRaw.fecha_creacion,
        };

        return { success: true, data: [empresa], error: null }; // Retornar solo el primer elemento
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.stack);
        } else {
            console.error("Se produjo un error desconocido:", err);
        }
        return { success: false, error: "Error al obtener las empresas" };
    }
};

async function isFieldDuplicate(
    field: "ruc" | "email",
    value: string,
    excludeEmpresaId?: number
): Promise<boolean> {
    const existingEmpresa = await prisma.empresa.findFirst({
        where: {
            [field]: value,
            ...(excludeEmpresaId ? { id_empresa: { not: excludeEmpresaId } } : {}),
        },
    });
    return !!existingEmpresa;
}
export const createEmpresa = async (
    currentState: CurrentState,
    data: EmpresaSchema
) => {
    try {
        if (await isFieldDuplicate("ruc", data.ruc)) {
            return { success: false, error: "El RUC ya está registrado" };
        }
        if (data.email && (await isFieldDuplicate("email", data.email))) {
            return { success: false, error: "El email ya está registrado" };
        }

        await prisma.empresa.create({
            data: {
                ruc: data.ruc,
                razon_social: data.razon_social,
                nombre_comercial: data.nombre_comercial,
                domicilio_fiscal: data.domicilio_fiscal,
                ubigeo: data.ubigeo,
                actividad_economica: data.actividad_economica,
                tipo_contribuyente: data.tipo_contribuyente,
                clave_sol: data.clave_sol,
                telefono: data.telefono,
                email: data.email,
            },
        });
        return { success: true, error: null };
    } catch (err) {
        console.error("Error al crear la empresa:", err);
        return { success: false, error: "Error al crear la empresa" };
    }
};

export const updateEmpresa = async (
    currentState: CurrentState,
    data: EmpresaSchema
) => {
    try {
        const empresa = await prisma.empresa.findUnique({
            where: { id_empresa: data.id_empresa! },
        });
        if (!empresa) {
            return { success: false, error: "Empresa no encontrada" };
        }
        if (await isFieldDuplicate("ruc", data.ruc, data.id_empresa)) {
            return { success: false, error: "El RUC ya está registrado" };
        }
        if (data.email && (await isFieldDuplicate("email", data.email, data.id_empresa))) {
            return { success: false, error: "El email ya está registrado" };
        }

        await prisma.empresa.update({
            where: { id_empresa: data.id_empresa! },
            data: {
                ruc: data.ruc,
                razon_social: data.razon_social,
                nombre_comercial: data.nombre_comercial,
                domicilio_fiscal: data.domicilio_fiscal,
                ubigeo: data.ubigeo,
                actividad_economica: data.actividad_economica,
                tipo_contribuyente: data.tipo_contribuyente,
                clave_sol: data.clave_sol,
                telefono: data.telefono,
                email: data.email,
            },
        });
        return { success: true, error: null };
    } catch (err) {
        console.error("Error al actualizar la empresa:", err);
        return { success: false, error: "Error al actualizar la empresa" };
    }
};


export const deleteEmpresa = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    const empresaId = parseInt(id, 10);
    if (isNaN(empresaId)) {
        throw new Error("ID de empresa inválido");
    }
    try {
        await prisma.empresa.update({
            where: { id_empresa: empresaId },
            data: { deletedAt: new Date() },
        });
        return { success: true, error: null };
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.stack);
        } else {
            console.error("Se produjo un error desconocido:", err);
        }
        return { success: false, error: "Error al eliminar la empresa" };
    }
};