export interface FormState {
    id_paciente: number;
    fecha_ultima_consulta?: string;
    estado_tratamiento?: string;
    fecha_alta?: string;
  
    hc?: string;
    fecha?: string;
    hora?: string;
  
    paciente?: string;
    edad?: string;
    sexo?: string;
    lugar_fecha_nacimiento?: string;
    direccion?: string;
    procedencia?: string;
    ocupacion?: string;
    viajes?: string;
    telefono?: string;
    emergencia?: string;
  
    motivo_consulta?: string;
    enfermedad_actual?: string;
    tiempo_enfermedad?: string;
    signos_sintomas?: string;
    relato_cronologico?: string;
    funciones_biologicas?: string;
  
    antecedentes_familiares?: string;
    antecedentes_personales?: string;
  
    signos_pa?: string;
    pulso?: string;
    temp?: string;
    fc?: string;
    f_resp?: string;
  
    examen_ocl?: string;
    cie10_presuntivo?: string;
    cie10_definitivo?: string;
    plan_tratamiento?: string;
    pronostico?: string;
    recomendaciones?: string;
    control_evolucion?: string;
    alta_paciente?: string;
    profesional_nombre?: string;
    estado_civil ?: string;
    grado_instruccion ?: string;
    religion ?: string;
    nombre_apoderado ?: string;
  
    // Datos del apoderado
    dni_apoderado?: string;
    cel_apoderado?: string;
    correo_apoderado?: string;
  
    // Generales
    antecedente_ram?: boolean;
    antecedente_lidocaina?: boolean;
    antecedente_tabaco?: boolean;
    antecedente_alcohol?: boolean;
    antecedente_otros_generales?: string;
  
    // Fisiológicos
    sed?: string;
    apetito?: string;
    deposicion?: string;
    miccion?: string;
  
    // Inmunológicos
    antecedente_ar?: boolean;
    antecedente_les?: boolean;
    antecedente_vih?: boolean;
    antecedente_otros_inmunologicos?: string;
  
    // Patológicos
    antecedente_hta?: boolean;
    antecedente_dm?: boolean;
    antecedente_iam?: boolean;
    antecedente_anemia?: boolean;
    antecedente_asma?: boolean;
    antecedente_tbc?: boolean;
    antecedente_otros_patologicos?: string;
  
    // Familiares
    antecedente_familiar_hta?: boolean;
    antecedente_familiar_dm?: boolean;
    antecedente_familiar_iam?: boolean;
    antecedente_familiar_anemia?: boolean;
    antecedente_familiar_asma?: boolean;
    antecedente_familiar_tbc?: boolean;
    antecedente_otros_familiares?: string;
  
    // Epidemiológicos
    antecedente_dengue?: boolean;
    antecedente_fiebre_amarilla?: boolean;
    antecedente_its?: boolean;
    antecedente_otros_epidemiologicos?: string;
  
    // Ocupacionales
    antecedente_stress?: boolean;
    antecedente_trauma_acustico?: boolean;
    antecedente_mercurialismo?: boolean;
    antecedente_otros_ocupacionales?: string;
  
    // Farmacológicos
    antecedente_farmacologicos?: string;
  
    // Especificación de antecedentes
    especificacion_antecedentes?: string;
  
    // Evaluación odontológica
    examen_extraoral?: string;
    examen_intraoral?: string;
    
  };