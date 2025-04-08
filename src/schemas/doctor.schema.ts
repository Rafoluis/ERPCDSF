import { z } from "zod";

export const doctorSchema = z.object({
    id_empleado: z.coerce.number().optional(),
    nombre: z.string().min(1, { message: "Nombre requerido" }),
    apellido: z.string().min(1, { message: "Apellido requerido" }),
    dni: z.string().regex(/^\d{8}$/, { message: "DNI inválido. Debe contener 8 dígitos." }),
    sexo: z.enum(["MASCULINO", "FEMENINO"]),
    email: z.string().email({ message: "Email inválido" }).optional(),
    telefono: z.string().min(1, { message: "Teléfono requerido" }),
    direccion: z.string().optional(),
    password: z.string().min(5, { message: "La contraseña debe tener más de 5 caracteres" }),
    especialidad: z.string().min(1, { message: "Especialidad requerida" }),
});

export type DoctorSchema = z.infer<typeof doctorSchema>;