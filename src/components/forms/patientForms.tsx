"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../inputField";
import { createPatient, updatePatient } from "@/actions/serverActions";
import { patientSchema, PatientSchema } from "@/lib/formSchema";
import { startTransition, useActionState } from "react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const PatientForm = ({
    type,
    data,
    setOpen,
}: {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PatientSchema>({
        resolver: zodResolver(patientSchema),
    });

    const [state, formAction] = useActionState(
        type === "create" ? createPatient : updatePatient,
        { success: false, error: null }
    );

    const onSubmit = handleSubmit((data) => {

        console.log("Fecha UTC enviada:", data);

        startTransition(() => {
            formAction(data);
        });
    });

    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast(`El paciente ha sido ${type === "create" ? "creado" : "actualizado"}`);
            setOpen(false);
            router.refresh();
        } else if (state.error) {
            toast("Error en la acción: " + state.error);
            console.error("Error en la acción: ", state.error);
        }
    }, [state]);

    //const {} = relatedData;

    const formatDateToLocalString = (date: Date) => {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Meses van de 0 a 11
        const day = String(date.getUTCDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Registrar nuevo paciente" : "Actualizar paciente"}
            </h1>
            {data && (
                <InputField
                    label="Id"
                    name="id_paciente"
                    defaultValue={data?.id_paciente}
                    register={register}
                    error={errors?.id_paciente}
                    hidden
                />
            )}
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Nombre del paciente"
                    name="nombre"
                    defaultValue={data?.nombre}
                    register={register}
                    error={errors.nombre}
                />

                <InputField
                    label="Apellido del paciente"
                    name="apellido"
                    defaultValue={data?.apellido}
                    register={register}
                    error={errors?.apellido}
                />

                <div className="flex flex-col gap-2 w-full md:w-1/2">
                    <InputField
                        label="DNI"
                        name="dni"
                        defaultValue={data?.dni}
                        register={register}
                        error={errors.dni}
                    />
                    <InputField
                        label="Teléfono"
                        name="telefono"
                        defaultValue={data?.telefono}
                        register={register}
                        error={errors?.telefono}
                    />
                    <label className="text-xs text-gray-500">Sexo</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("sexo")}
                        defaultValue={data?.sexo}
                    >
                        <option value="MASCULINO">Masculino</option>
                        <option value="FEMENINO">Femenino</option>

                    </select>
                    {errors.sexo?.message && (
                        <p className="text-xs text-red-400">
                            {errors.sexo.message.toString()}
                        </p>
                    )}
                    <InputField
                        label="Fecha de nacimiento"
                        name="fecha_nacimiento"
                        defaultValue={
                            data?.fecha_cita
                                ? new Date(data.fecha_cita).toLocaleString("sv-SE", { timeZone: "America/Lima" }).replace(" ", "T")
                                : ""
                        }
                        register={register}
                        error={errors.fecha_nacimiento}
                        type="date"
                    />

                </div>
            </div>
            {state.error && <span className="text-red-400"> Algo paso mal </span>}
            <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Crear" : "Actualizar"}</button>
        </form>
    );
};

export default PatientForm