import { UseFormSetValue, Path, PathValue } from "react-hook-form";

function fillPatientFields<T extends Record<string, any>>(
  p: {
    nombre: string;
    apellido: string;
    edad: string;
    sexo: string;
    lugar_fecha_nacimiento: string;
    direccion: string;
    procedencia: string;
    ocupacion: string;
    viajes: string;
    telefono: string;
    emergencia: string;
    estado_civil: string;
    grado_instruccion: string;
    religion: string;
  },
  setValue: UseFormSetValue<T>
) {
  setValue("paciente" as Path<T>, `${p.nombre} ${p.apellido}` as PathValue<T, Path<T>>);
  setValue("edad" as Path<T>, p.edad as PathValue<T, Path<T>>);
  setValue("sexo" as Path<T>, p.sexo as PathValue<T, Path<T>>);
  setValue(
    "lugar_fecha_nacimiento" as Path<T>,
    p.lugar_fecha_nacimiento as PathValue<T, Path<T>>
  );
  setValue("direccion" as Path<T>, p.direccion as PathValue<T, Path<T>>);
  setValue("procedencia" as Path<T>, p.procedencia as PathValue<T, Path<T>>);
  setValue("ocupacion" as Path<T>, p.ocupacion as PathValue<T, Path<T>>);
  setValue("viajes" as Path<T>, p.viajes as PathValue<T, Path<T>>);
  setValue("telefono" as Path<T>, p.telefono as PathValue<T, Path<T>>);
  setValue("emergencia" as Path<T>, p.emergencia as PathValue<T, Path<T>>);
  setValue("estado_civil" as Path<T>, p.estado_civil as PathValue<T, Path<T>>);
  setValue(
    "grado_instruccion" as Path<T>,
    p.grado_instruccion as PathValue<T, Path<T>>
  );
  setValue("religion" as Path<T>, p.religion as PathValue<T, Path<T>>);
}
