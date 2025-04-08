import { z } from 'zod'

export const pagoSchema = z.object({
    monto: z.number().positive({ message: "El monto debe ser mayor que 0" }),
    fecha_pago: z.coerce.date({ message: "Fecha requerida" }),
    medio_pago: z.enum(
        [
            "EFECTIVO",
            "TARJETA DEBITO",
            "TARJETA CREDITO",
            "DEPOSITO BANCARIO",
            "YAPE - PLIN",
        ],
        { message: "Medio de pago inválido" }
    ),
});

export const ticketSchema = z
    .object({
        id_ticket: z.coerce.number().optional(),
        id_paciente: z.coerce.number().min(1, { message: "Paciente requerido" }),
        citas: z
            .array(z.coerce.number().min(1, { message: "ID de cita requerido" }))
            .optional(),
        fecha_emision: z.coerce.date({ message: "Fecha requerida" }),
        tipo_comprobante: z.enum(["BOLETA", "FACTURA"], {
            message: "Tipo requerido",
        }),
        medio_pago: z.enum(
            [
                "EFECTIVO",
                "TARJETA DEBITO",
                "TARJETA CREDITO",
                "DEPOSITO BANCARIO",
                "YAPE - PLIN",
            ],
            { message: "Medio requerido" }
        ),
        fraccionar_pago: z.boolean().optional(),
        monto_parcial: z
            .preprocess(
                (val) =>
                    val === "" || val === undefined ? 0 : parseFloat(val as string),
                z.number().min(0, { message: "El monto parcial debe ser mayor o igual a 0" }).optional()
            ),
        monto_total: z.number().min(0, { message: "El monto total es obligatorio" }),
        pagos: z.array(pagoSchema).optional(),
    })
    .superRefine((data, ctx) => {
        if (data.fraccionar_pago) {
            if (!data.monto_parcial || data.monto_parcial <= 0) {
                ctx.addIssue({
                    path: ["monto_parcial"],
                    code: z.ZodIssueCode.custom,
                    message:
                        "Ingrese un monto parcial válido si está fraccionando el pago",
                });
            }
            if (data.monto_parcial !== undefined && data.monto_parcial >= data.monto_total) {
                ctx.addIssue({
                    path: ["monto_parcial"],
                    code: z.ZodIssueCode.custom,
                    message: "El monto parcial debe ser menor que el monto total",
                });
            }
        } else {
            if (data.monto_parcial && data.monto_parcial > 0) {
                ctx.addIssue({
                    path: ["monto_parcial"],
                    code: z.ZodIssueCode.custom,
                    message: "No se debe ingresar un monto parcial si no se fracciona el pago",
                });
            }
        }
    });

export type TicketSchema = z.infer<typeof ticketSchema>;