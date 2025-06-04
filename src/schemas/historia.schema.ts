import { z } from "zod";

export const historiaSchema = z
  .object({
    id_historia: z.coerce.number().optional(),
    id_paciente: z.coerce
      .number()
      .min(1, { message: "Paciente requerido" }),

    // Fechas y estados
    fecha_ultima_consulta: z
      .string()
      .optional()
      .refine((s) => !s || !isNaN(Date.parse(s)), {
        message: "Fecha de última consulta inválida",
      }),
    estado_tratamiento: z.string().optional(),
    fecha_alta: z
      .string()
      .optional()
      .refine((s) => !s || !isNaN(Date.parse(s)), {
        message: "Fecha de alta inválida",
      }),

    // Datos de sesión
    hc: z.string().optional(),
    fecha: z.string().optional(),
    hora: z.string().optional(),

    // Datos demográficos (si aún los quieres aquí)
    paciente: z.string().optional(),
    edad: z.string().optional(),
    sexo: z.string().optional(),
    lugar_fecha_nacimiento: z.string().optional(),
    direccion: z.string().optional(),
    procedencia: z.string().optional(),
    ocupacion: z.string().optional(),
    viajes: z.string().optional(),
    telefono: z.string().optional(),
    emergencia: z.string().optional(),
    estado_civil: z.string().optional(),
    grado_instruccion: z.string().optional(),
    religion: z.string().optional(),

    // Motivo y relato
    motivo_consulta: z.string().optional(),
    enfermedad_actual: z.string().optional(),
    tiempo_enfermedad: z.string().optional(),
    signos_sintomas: z.string().optional(),
    relato_cronologico: z.string().optional(),
    funciones_biologicas: z.string().optional(),

    // Antecedentes
    antecedentes_familiares: z.string().optional(),
    antecedentes_personales: z.string().optional(),

    // Signos vitales
    signos_pa: z.string().optional(),
    pulso: z.string().optional(),
    temp: z.string().optional(),
    fc: z.string().optional(),
    f_resp: z.string().optional(),

    // Exámenes y diagnósticos
    examen_ocl: z.string().optional(),
    cie10_presuntivo: z.string().optional(),
    cie10_definitivo: z.string().optional(),

    // Plan y seguimiento
    plan_tratamiento: z.string().optional(),
    pronostico: z.string().optional(),
    recomendaciones: z.string().optional(),
    control_evolucion: z.string().optional(),
    alta_paciente: z.string().optional(),
    profesional_nombre: z.string().optional(),

    // Apoderado
    nombre_apoderado: z.string().optional(),
    dni_apoderado: z.string().optional(),
    cel_apoderado: z.string().optional(),
    correo_apoderado: z
      .string()
      .email({ message: "Correo de apoderado inválido" })
      .optional(),

    // Generales (booleanos + texto)
    antecedente_ram: z.boolean().optional(),
    antecedente_lidocaina: z.boolean().optional(),
    antecedente_tabaco: z.boolean().optional(),
    antecedente_alcohol: z.boolean().optional(),
    antecedente_otros_generales: z.string().optional(),

    // Fisiológicos
    sed: z.string().optional(),
    apetito: z.string().optional(),
    deposicion: z.string().optional(),
    miccion: z.string().optional(),

    // Inmunológicos
    antecedente_ar: z.boolean().optional(),
    antecedente_les: z.boolean().optional(),
    antecedente_vih: z.boolean().optional(),
    antecedente_otros_inmunologicos: z.string().optional(),

    // Patológicos
    antecedente_hta: z.boolean().optional(),
    antecedente_dm: z.boolean().optional(),
    antecedente_iam: z.boolean().optional(),
    antecedente_anemia: z.boolean().optional(),
    antecedente_asma: z.boolean().optional(),
    antecedente_tbc: z.boolean().optional(),
    antecedente_otros_patologicos: z.string().optional(),

    // Familiares
    antecedente_familiar_hta: z.boolean().optional(),
    antecedente_familiar_dm: z.boolean().optional(),
    antecedente_familiar_iam: z.boolean().optional(),
    antecedente_familiar_anemia: z.boolean().optional(),
    antecedente_familiar_asma: z.boolean().optional(),
    antecedente_familiar_tbc: z.boolean().optional(),
    antecedente_otros_familiares: z.string().optional(),

    // Epidemiológicos
    antecedente_dengue: z.boolean().optional(),
    antecedente_fiebre_amarilla: z.boolean().optional(),
    antecedente_its: z.boolean().optional(),
    antecedente_otros_epidemiologicos: z.string().optional(),

    // Ocupacionales
    antecedente_stress: z.boolean().optional(),
    antecedente_trauma_acustico: z.boolean().optional(),
    antecedente_mercurialismo: z.boolean().optional(),
    antecedente_otros_ocupacionales: z.string().optional(),

    // Farmacológicos y especificación
    antecedente_farmacologicos: z.string().optional(),
    especificacion_antecedentes: z.string().optional(),

    // Evaluación odontológica
    examen_extraoral: z.string().optional(),
    examen_intraoral: z.string().optional(),

    fecha_alta_paciente: z
  .string()
  .optional()
  .refine((s) => !s || !isNaN(Date.parse(s)), {
    message: "Fecha de alta paciente inválida",
  }),

telefono_apoderado: z.string().optional(),
direccion_apoderado: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.cie10_presuntivo || data.cie10_definitivo) &&
      !data.plan_tratamiento
    ) {
      ctx.addIssue({
        path: ["plan_tratamiento"],
        code: z.ZodIssueCode.custom,
        message:
          "Debe indicar un plan de tratamiento si hay diagnóstico CIE-10",
      });
    }
  });

export type HistoriaSchema = z.infer<typeof historiaSchema>;
