import { z } from "zod";

export const patientSchema = z.object({
    id_paciente: z.coerce.number().optional(),
    nombre: z.string().min(1, { message: "Nombre requerido" }),
    apellido: z.string().min(1, { message: "Apellido requerido" }),
    dni: z.string().regex(/^\d{8}$/, { message: "DNI inválido. Debe contener 8 dígitos." }),
    sexo: z.enum(["MASCULINO", "FEMENINO"]),
    fecha_nacimiento: z.coerce.date({ message: "Fecha nacimiento requerida" }),
    telefono: z.string().min(1, { message: "Teléfono requerido" }),
    password: z.string().optional(),
});

export type PatientSchema = z.infer<typeof patientSchema>;