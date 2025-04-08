import { z } from "zod";

export const serviceSchema = z.object({
    id_servicio: z.coerce.number().optional(),
    nombre_servicio: z.string().min(1, { message: "Nombre requerido" }),
    descripcion: z.string().optional(),
    tarifa: z.coerce.number().min(1, { message: "La tarifa debe ser al menos 1" }),
});

export type ServiceSchema = z.infer<typeof serviceSchema>;