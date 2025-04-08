import { z } from 'zod'

export const appointmentSchema = z.object({
    id_cita: z.coerce.number().optional(),
    id_paciente: z.preprocess(
        (val) => {
            if (val === "" || val == null) return undefined;
            return Number(val);
        },
        z.number().min(1, { message: "Paciente requerido" }).optional()
    ).refine((val) => val !== undefined, { message: "Paciente requerido" }),
    fecha_cita: z.coerce.date({ message: "Fecha y hora requerida" }),
    hora_cita_final: z
        .string()
        .refine(
            (value) => value === "" || /^([01]\d|2[0-3]):([0-5]\d)$/.test(value),
            { message: "Formato de hora inválido (HH:MM)" }
        )
        .optional(),
    servicios: z
        .array(
            z.object({
                id_servicio: z.preprocess(
                    (val) => {
                        if (val === "" || val == null) return undefined;
                        return Number(val);
                    },
                    z.number().min(1, { message: "ID de servicio inválido" }).optional()
                ).refine((val) => val !== undefined, { message: "ID de servicio inválido" }),
                cantidad: z.preprocess(
                    (val) => {
                        if (val === "" || val == null) return undefined;
                        return Number(val);
                    },
                    z.number().min(1, { message: "Cantidad inválida" }).optional()
                ).refine((val) => val !== undefined, { message: "Cantidad inválida" }),
            })
        )
        .min(1, { message: "Debe seleccionar al menos un servicio" }),
    id_empleado: z.preprocess(
        (val) => {
            if (val === "" || val == null) return undefined;
            return Number(val);
        },
        z.number().min(1, { message: "Doctor requerido" }).optional()
    ).refine((val) => val !== undefined, { message: "Doctor requerido" }),
    estado: z.enum(
        ["AGENDADO", "COMPLETADO", "EN_PROCESO", "FINALIZADO", "CANCELADO"],
        { message: "Estado requerido" }
    ),
    cantidad: z.coerce.number().min(1, { message: "La tarifa debe ser al menos 1" }),
});

export type AppointmentSchema = z.infer<typeof appointmentSchema>;