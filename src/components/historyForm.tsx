"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { useState } from "react";
import { createHistoria } from "@/actions/historia.actions";
import { HistoriaSchema, historiaSchema } from "@/schemas/historia.schema";
import { Check, Printer, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HistoriaForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HistoriaSchema>({
    resolver: zodResolver(historiaSchema),
    defaultValues: {},
  });

  const [tab, setTab] = useState("datos-generales");

  const onSubmit = async (data: HistoriaSchema) => {
    await createHistoria({ success: false, error: null }, data);
    alert("Historia guardada correctamente");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="bg-backgrounddefault p-4 rounded-md flex-1 m-4 mt-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="hidden md:block text-ls font-semibold">Nueva historia clínica odontológica</h1>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-auto px-4 py-2 rounded-full bg-indigo-200 hover:bg-indigo-300 flex items-center justify-center"
            >
              <Printer size={20} />
              <span className="ml-2 text-sm font-medium">Imprimir</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/list/dentalHistory")}
              className="w-auto px-4 py-2 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center"
            >
              <X size={20} color="white" />
              <span className="ml-2 text-sm font-medium text-white">Cancelar</span>
            </button>
            <button
              type="submit"
              className="w-auto px-4 py-2 rounded-full bg-backbuttondefault hover:bg-backbuttonhover flex items-center justify-center"
            >
              <Check size={20} color="white" />
              <span className="ml-2 text-sm font-medium text-textdefault">Guardar</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/list/odontograma")}
              className="w-auto px-4 py-2 rounded-full bg-backbuttondefault hover:bg-backbuttonhover flex items-center justify-center"
            >
              <img src="/diente.png" alt="Ícono" className="h-5 w-5" />
              <span className="ml-2 text-sm font-medium text-textdefault">Odontograma</span>
            </button>

          </div>
        </div>
        <section className="border p-4 rounded-md">
    <h2 className="text-lg font-semibold mb-4">Datos Generales</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <input {...register("id_paciente")} placeholder="ID Paciente" className="input" />
      <input {...register("fecha_ultima_consulta")} type="date" placeholder="Fecha última consulta" className="input" />
      <input {...register("estado_tratamiento")} placeholder="Estado tratamiento" className="input" />
      <input {...register("fecha_alta")} type="date" placeholder="Fecha alta" className="input" />
      <input {...register("paciente")} placeholder="Nombre del paciente" className="input" />
      <input {...register("edad")} placeholder="Edad" className="input" />
      <input {...register("sexo")} placeholder="Sexo" className="input" />
      <input {...register("lugar_fecha_nacimiento")} placeholder="Lugar y fecha de nacimiento" className="input" />
      <input {...register("direccion")} placeholder="Dirección" className="input" />
      <input {...register("procedencia")} placeholder="Procedencia" className="input" />
      <input {...register("ocupacion")} placeholder="Ocupación" className="input" />
      <input {...register("viajes")} placeholder="Viajes recientes" className="input" />
      <input {...register("telefono")} placeholder="Teléfono" className="input" />
      <input {...register("emergencia")} placeholder="Contacto de emergencia" className="input" />
      <input {...register("estado_civil")} placeholder="Estado civil" className="input" />
      <input {...register("grado_instruccion")} placeholder="Grado de instrucción" className="input" />
      <input {...register("religion")} placeholder="Religión" className="input" />
      <input {...register("hc")} placeholder="HC" className="input" />
      <input {...register("fecha")} type="date" placeholder="Fecha" className="input" />
      <input {...register("hora")} placeholder="Hora" className="input" />
    </div>
  </section>

  {/* Consulta Actual */}
  <section className="border p-4 rounded-md">
    <h2 className="text-lg font-semibold mb-4">Consulta Actual</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <textarea {...register("motivo_consulta")} placeholder="Motivo de consulta" className="textarea" />
      <textarea {...register("enfermedad_actual")} placeholder="Enfermedad actual" className="textarea" />
      <input {...register("tiempo_enfermedad")} placeholder="Tiempo de enfermedad" className="input" />
      <textarea {...register("signos_sintomas")} placeholder="Signos y síntomas" className="textarea" />
      <textarea {...register("relato_cronologico")} placeholder="Relato cronológico" className="textarea" />
      <textarea {...register("funciones_biologicas")} placeholder="Funciones biológicas" className="textarea" />
    </div>
  </section>

  {/* Antecedentes Generales */}
  <section className="border p-4 rounded-md">
    <h2 className="text-lg font-semibold mb-4">Antecedentes Generales</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <label><input type="checkbox" {...register("antecedente_ram")} /> Alergia RAM</label>
      <label><input type="checkbox" {...register("antecedente_lidocaina")} /> Alergia a lidocaína</label>
      <label><input type="checkbox" {...register("antecedente_tabaco")} /> Tabaco</label>
      <label><input type="checkbox" {...register("antecedente_alcohol")} /> Alcohol</label>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <textarea {...register("antecedente_otros_generales")} placeholder="Otros antecedentes generales" className="textarea" />
      <textarea {...register("antecedentes_personales")} placeholder="Antecedentes personales" className="textarea" />
      <textarea {...register("antecedentes_familiares")} placeholder="Antecedentes familiares" className="textarea" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <input {...register("sed")} placeholder="Sed" className="input" />
      <input {...register("apetito")} placeholder="Apetito" className="input" />
      <input {...register("deposicion")} placeholder="Deposición" className="input" />
      <input {...register("miccion")} placeholder="Micción" className="input" />
    </div>
  </section>
  {/* Antecedentes Inmunológicos */}
<section className="border p-4 rounded-md">
  <h2 className="text-lg font-semibold mb-4">Antecedentes Inmunológicos</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <label><input type="checkbox" {...register("antecedente_ar")} /> Artritis Reumatoide</label>
    <label><input type="checkbox" {...register("antecedente_les")} /> Lupus Eritematoso Sistémico</label>
    <label><input type="checkbox" {...register("antecedente_vih")} /> VIH</label>
    <textarea {...register("antecedente_otros_inmunologicos")} placeholder="Otros antecedentes inmunológicos" className="textarea col-span-full" />
  </div>
</section>

{/* Antecedentes Patológicos */}
<section className="border p-4 rounded-md">
  <h2 className="text-lg font-semibold mb-4">Antecedentes Patológicos</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <label><input type="checkbox" {...register("antecedente_hta")} /> Hipertensión Arterial</label>
    <label><input type="checkbox" {...register("antecedente_dm")} /> Diabetes Mellitus</label>
    <label><input type="checkbox" {...register("antecedente_iam")} /> Infarto Agudo de Miocardio</label>
    <label><input type="checkbox" {...register("antecedente_anemia")} /> Anemia</label>
    <label><input type="checkbox" {...register("antecedente_asma")} /> Asma</label>
    <label><input type="checkbox" {...register("antecedente_tbc")} /> Tuberculosis</label>
    <textarea {...register("antecedente_otros_patologicos")} placeholder="Otros antecedentes patológicos" className="textarea col-span-full" />
  </div>
</section>

{/* Antecedentes Familiares */}
<section className="border p-4 rounded-md">
  <h2 className="text-lg font-semibold mb-4">Antecedentes Familiares</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <label><input type="checkbox" {...register("antecedente_familiar_hta")} /> Familiar con Hipertensión</label>
    <label><input type="checkbox" {...register("antecedente_familiar_dm")} /> Familiar con Diabetes Mellitus</label>
    <label><input type="checkbox" {...register("antecedente_familiar_iam")} /> Familiar con Infarto</label>
    <label><input type="checkbox" {...register("antecedente_familiar_anemia")} /> Familiar con Anemia</label>
    <label><input type="checkbox" {...register("antecedente_familiar_asma")} /> Familiar con Asma</label>
    <label><input type="checkbox" {...register("antecedente_familiar_tbc")} /> Familiar con Tuberculosis</label>
    <textarea {...register("antecedente_otros_familiares")} placeholder="Otros antecedentes familiares" className="textarea col-span-full" />
  </div>
</section>

{/* Antecedentes Epidemiológicos */}
<section className="border p-4 rounded-md">
  <h2 className="text-lg font-semibold mb-4">Antecedentes Epidemiológicos</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <label><input type="checkbox" {...register("antecedente_dengue")} /> Dengue</label>
    <label><input type="checkbox" {...register("antecedente_fiebre_amarilla")} /> Fiebre Amarilla</label>
    <label><input type="checkbox" {...register("antecedente_its")} /> ITS</label>
    <textarea {...register("antecedente_otros_epidemiologicos")} placeholder="Otros antecedentes epidemiológicos" className="textarea col-span-full" />
  </div>
</section>

{/* Antecedentes Ocupacionales */}
<section className="border p-4 rounded-md">
  <h2 className="text-lg font-semibold mb-4">Antecedentes Ocupacionales</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <label><input type="checkbox" {...register("antecedente_stress")} /> Estrés</label>
    <label><input type="checkbox" {...register("antecedente_trauma_acustico")} /> Trauma Acústico</label>
    <label><input type="checkbox" {...register("antecedente_mercurialismo")} /> Mercurialismo</label>
    <textarea {...register("antecedente_otros_ocupacionales")} placeholder="Otros antecedentes ocupacionales" className="textarea col-span-full" />
    <textarea {...register("antecedente_farmacologicos")} placeholder="Antecedentes farmacológicos" className="textarea col-span-full" />
    <textarea {...register("especificacion_antecedentes")} placeholder="Especificación de antecedentes" className="textarea col-span-full" />
  </div>
</section>

{/* Examen Clínico */}
<section className="border p-4 rounded-md">
  <h2 className="text-lg font-semibold mb-4">Examen Clínico</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <input {...register("signos_pa")} placeholder="Presión arterial" className="input" />
    <input {...register("pulso")} placeholder="Pulso" className="input" />
    <input {...register("temp")} placeholder="Temperatura" className="input" />
    <input {...register("fc")} placeholder="Frecuencia cardiaca" className="input" />
    <input {...register("f_resp")} placeholder="Frecuencia respiratoria" className="input" />
    <textarea {...register("examen_extraoral")} placeholder="Examen extraoral" className="textarea col-span-full" />
    <textarea {...register("examen_intraoral")} placeholder="Examen intraoral" className="textarea col-span-full" />
    <textarea {...register("examen_ocl")} placeholder="Examen de oclusión" className="textarea col-span-full" />
  </div>
</section>

{/* Diagnóstico y Plan */}
<section className="border p-4 rounded-md">
  <h2 className="text-lg font-semibold mb-4">Diagnóstico y Plan</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <input {...register("cie10_presuntivo")} placeholder="CIE-10 Presuntivo" className="input" />
    <input {...register("cie10_definitivo")} placeholder="CIE-10 Definitivo" className="input" />
    <input {...register("fecha_alta_paciente")} type="date" placeholder="Fecha de alta" className="input" />
    <textarea {...register("plan_tratamiento")} placeholder="Plan de tratamiento" className="textarea col-span-full" />
    <textarea {...register("pronostico")} placeholder="Pronóstico" className="textarea col-span-full" />
    <textarea {...register("recomendaciones")} placeholder="Recomendaciones" className="textarea col-span-full" />
    <textarea {...register("control_evolucion")} placeholder="Control de evolución" className="textarea col-span-full" />
    
  </div>
</section>

{/* Apoderado */}
<section className="border p-4 rounded-md">
  <h2 className="text-lg font-semibold mb-4">Apoderado</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <input {...register("nombre_apoderado")} placeholder="Nombre apoderado" className="input" />
    <input {...register("telefono_apoderado")} placeholder="Teléfono apoderado" className="input" />
    <input {...register("direccion_apoderado")} placeholder="Dirección apoderado" className="input" />
    <input {...register("dni_apoderado")} placeholder="DNI apoderado" className="input" />
  </div>
</section>

{/* Profesional */}
<section className="border p-4 rounded-md">
  <h2 className="text-lg font-semibold mb-4">Profesional</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <input {...register("profesional_nombre")} placeholder="Nombre profesional" className="input" />
    {/* 
    <input {...register("profesional_colegiado")} placeholder="Colegiado profesional" className="input" />
    <input {...register("profesional_especialidad")} placeholder="Especialidad profesional" className="input" /> 
    */}
  </div>
</section>

    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
      Guardar Historia
    </button>
    </div>
  </form>
  );
}
