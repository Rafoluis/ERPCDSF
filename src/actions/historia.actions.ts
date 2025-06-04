"use server"

import { HistoriaSchema } from "@/schemas/historia.schema";
import prisma from "../lib/prisma";

type CurrentState = { success: boolean; error: string | null };

export const createHistoria = async (
  currentState: CurrentState,
  data: HistoriaSchema
) => {
  try {
    await prisma.historia_Clinica.create({
      data: {
        id_paciente: data.id_paciente,
        fecha_ultima_consulta: data.fecha_ultima_consulta
          ? new Date(data.fecha_ultima_consulta)
          : undefined,
        estado_tratamiento: data.estado_tratamiento,
        fecha_alta: data.fecha_alta ? new Date(data.fecha_alta) : undefined,

        hc: data.hc,
        fecha: data.fecha,
        hora: data.hora,

        motivo_consulta: data.motivo_consulta,
        enfermedad_actual: data.enfermedad_actual,
        tiempo_enfermedad: data.tiempo_enfermedad,
        signos_sintomas: data.signos_sintomas,
        relato_cronologico: data.relato_cronologico,
        funciones_biologicas: data.funciones_biologicas,

        antecedentes_familiares: data.antecedentes_familiares,
        antecedentes_personales: data.antecedentes_personales,

        signos_pa: data.signos_pa,
        pulso: data.pulso,
        temp: data.temp,
        fc: data.fc,
        f_resp: data.f_resp,

        examen_ocl: data.examen_ocl,
        cie10_presuntivo: data.cie10_presuntivo,
        cie10_definitivo: data.cie10_definitivo,
        plan_tratamiento: data.plan_tratamiento,
        pronostico: data.pronostico,
        recomendaciones: data.recomendaciones,
        control_evolucion: data.control_evolucion,
        alta_paciente: data.alta_paciente,
        profesional_nombre: data.profesional_nombre,

        nombre_apoderado: data.nombre_apoderado,
        dni_apoderado: data.dni_apoderado,
        cel_apoderado: data.cel_apoderado,
        correo_apoderado: data.correo_apoderado,

        antecedente_ram: data.antecedente_ram,
        antecedente_lidocaina: data.antecedente_lidocaina,
        antecedente_tabaco: data.antecedente_tabaco,
        antecedente_alcohol: data.antecedente_alcohol,
        antecedente_otros_generales: data.antecedente_otros_generales,

        sed: data.sed,
        apetito: data.apetito,
        deposicion: data.deposicion,
        miccion: data.miccion,

        antecedente_ar: data.antecedente_ar,
        antecedente_les: data.antecedente_les,
        antecedente_vih: data.antecedente_vih,
        antecedente_otros_inmunologicos: data.antecedente_otros_inmunologicos,

        antecedente_hta: data.antecedente_hta,
        antecedente_dm: data.antecedente_dm,
        antecedente_iam: data.antecedente_iam,
        antecedente_anemia: data.antecedente_anemia,
        antecedente_asma: data.antecedente_asma,
        antecedente_tbc: data.antecedente_tbc,
        antecedente_otros_patologicos: data.antecedente_otros_patologicos,

        antecedente_familiar_hta: data.antecedente_familiar_hta,
        antecedente_familiar_dm: data.antecedente_familiar_dm,
        antecedente_familiar_iam: data.antecedente_familiar_iam,
        antecedente_familiar_anemia: data.antecedente_familiar_anemia,
        antecedente_familiar_asma: data.antecedente_familiar_asma,
        antecedente_familiar_tbc: data.antecedente_familiar_tbc,
        antecedente_otros_familiares: data.antecedente_otros_familiares,

        antecedente_dengue: data.antecedente_dengue,
        antecedente_fiebre_amarilla: data.antecedente_fiebre_amarilla,
        antecedente_its: data.antecedente_its,
        antecedente_otros_epidemiologicos: data.antecedente_otros_epidemiologicos,

        antecedente_stress: data.antecedente_stress,
        antecedente_trauma_acustico: data.antecedente_trauma_acustico,
        antecedente_mercurialismo: data.antecedente_mercurialismo,
        antecedente_otros_ocupacionales: data.antecedente_otros_ocupacionales,

        antecedente_farmacologicos: data.antecedente_farmacologicos,
        especificacion_antecedentes: data.especificacion_antecedentes,

        examen_extraoral: data.examen_extraoral,
        examen_intraoral: data.examen_intraoral,
      },
    });
    return { success: true, error: null };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack);
    } else {
      console.error("Se produjo un error desconocido:", err);
    }
    return { success: false, error: "Error al crear historia clínica" };
  }
};

export const updateHistoria = async (
  currentState: CurrentState,
  data: HistoriaSchema
) => {
  try {
    await prisma.historia_Clinica.update({
      where: { id_historia: data.id_historia! },
      data: {
        fecha_ultima_consulta: data.fecha_ultima_consulta
          ? new Date(data.fecha_ultima_consulta)
          : undefined,
        estado_tratamiento: data.estado_tratamiento,
        fecha_alta: data.fecha_alta ? new Date(data.fecha_alta) : undefined,
        hc: data.hc,
        fecha: data.fecha,
        hora: data.hora,

        motivo_consulta: data.motivo_consulta,
        enfermedad_actual: data.enfermedad_actual,
        tiempo_enfermedad: data.tiempo_enfermedad,
        signos_sintomas: data.signos_sintomas,
        relato_cronologico: data.relato_cronologico,
        funciones_biologicas: data.funciones_biologicas,

        antecedentes_familiares: data.antecedentes_familiares,
        antecedentes_personales: data.antecedentes_personales,

        signos_pa: data.signos_pa,
        pulso: data.pulso,
        temp: data.temp,
        fc: data.fc,
        f_resp: data.f_resp,

        examen_ocl: data.examen_ocl,
        cie10_presuntivo: data.cie10_presuntivo,
        cie10_definitivo: data.cie10_definitivo,
        plan_tratamiento: data.plan_tratamiento,
        pronostico: data.pronostico,
        recomendaciones: data.recomendaciones,
        control_evolucion: data.control_evolucion,
        alta_paciente: data.alta_paciente,
        profesional_nombre: data.profesional_nombre,

        nombre_apoderado: data.nombre_apoderado,
        dni_apoderado: data.dni_apoderado,
        cel_apoderado: data.cel_apoderado,
        correo_apoderado: data.correo_apoderado,

        antecedente_ram: data.antecedente_ram,
        antecedente_lidocaina: data.antecedente_lidocaina,
        antecedente_tabaco: data.antecedente_tabaco,
        antecedente_alcohol: data.antecedente_alcohol,
        antecedente_otros_generales: data.antecedente_otros_generales,

        sed: data.sed,
        apetito: data.apetito,
        deposicion: data.deposicion,
        miccion: data.miccion,

        antecedente_ar: data.antecedente_ar,
        antecedente_les: data.antecedente_les,
        antecedente_vih: data.antecedente_vih,
        antecedente_otros_inmunologicos: data.antecedente_otros_inmunologicos,

        antecedente_hta: data.antecedente_hta,
        antecedente_dm: data.antecedente_dm,
        antecedente_iam: data.antecedente_iam,
        antecedente_anemia: data.antecedente_anemia,
        antecedente_asma: data.antecedente_asma,
        antecedente_tbc: data.antecedente_tbc,
        antecedente_otros_patologicos: data.antecedente_otros_patologicos,

        antecedente_familiar_hta: data.antecedente_familiar_hta,
        antecedente_familiar_dm: data.antecedente_familiar_dm,
        antecedente_familiar_iam: data.antecedente_familiar_iam,
        antecedente_familiar_anemia: data.antecedente_familiar_anemia,
        antecedente_familiar_asma: data.antecedente_familiar_asma,
        antecedente_familiar_tbc: data.antecedente_familiar_tbc,
        antecedente_otros_familiares: data.antecedente_otros_familiares,

        antecedente_dengue: data.antecedente_dengue,
        antecedente_fiebre_amarilla: data.antecedente_fiebre_amarilla,
        antecedente_its: data.antecedente_its,
        antecedente_otros_epidemiologicos: data.antecedente_otros_epidemiologicos,

        antecedente_stress: data.antecedente_stress,
        antecedente_trauma_acustico: data.antecedente_trauma_acustico,
        antecedente_mercurialismo: data.antecedente_mercurialismo,
        antecedente_otros_ocupacionales: data.antecedente_otros_ocupacionales,

        antecedente_farmacologicos: data.antecedente_farmacologicos,
        especificacion_antecedentes: data.especificacion_antecedentes,

        examen_extraoral: data.examen_extraoral,
        examen_intraoral: data.examen_intraoral,
      },
    });
    return { success: true, error: null };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack);
    } else {
      console.error("Se produjo un error desconocido:", err);
    }
    return { success: false, error: "Error al actualizar historia clínica" };
  }
};

export const deleteHistoria = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  const historiaId = parseInt(id, 10);
  if (isNaN(historiaId)) {
    throw new Error("ID de historia clínica inválido");
  }
  try {
    await prisma.historia_Clinica.update({
      where: { id_historia: historiaId },
      data: { deletedAt: new Date() },
    });
    return { success: true, error: null };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack);
    } else {
      console.error("Se produjo un error desconocido:", err);
    }
    return { success: false, error: "Error al eliminar la historia clínica" };
  }
};
