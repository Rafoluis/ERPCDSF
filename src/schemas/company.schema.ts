import { z } from "zod";

export const empresaSchema = z.object({
    id_empresa: z.coerce.number().optional(),
    ruc: z.string().regex(/^\d{11}$/, { message: "RUC inválido. Debe contener 11 dígitos." }),
    razon_social: z.string().min(1, { message: "Razón Social requerida" }),
    nombre_comercial: z.string().optional(),
    domicilio_fiscal: z.string().min(1, { message: "Domicilio fiscal requerido" }),
    ubigeo: z.string().length(6, { message: "Ubigeo inválido. Debe contener 6 caracteres." }),
    actividad_economica: z.string().optional(),
    tipo_contribuyente: z.string().optional(),
    clave_sol: z.string().min(1, { message: "Clave SOL requerida" }),
    telefono: z.string().min(6, { message: "Teléfono inválido" }).optional(),
    email: z.string().email({ message: "Correo electrónico inválido" }).optional(),
    fecha_creacion: z.coerce.date().optional(),
});

export type EmpresaSchema = z.infer<typeof empresaSchema>;
