"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../inputField";
import { patientSchema, PatientSchema } from "@/lib/formSchema";
import { startTransition, useActionState } from "react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createPatient, updatePatient } from "@/actions/patient.actions";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

interface PatientFormProps {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
    onSuccess?: (patient: any) => void;
}

const PatientForm = ({ type, data, setOpen, onSuccess }: PatientFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PatientSchema>({
        resolver: zodResolver(patientSchema),
    });

    const [submittedData, setSubmittedData] = useState<any>(null);
    const [state, formAction] = useActionState(
        type === "create" ? createPatient : updatePatient,
        { success: false, error: null }
    );

    const actionText = type === "create" ? "creado" : "actualizado";

    const onSubmit = handleSubmit((formData) => {
        setSubmittedData(formData);
        startTransition(() => {
            formAction(formData);
        });
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            showToast("success", `El paciente ha sido ${type === "create" ? "creado" : "actualizado"}`);
            router.refresh();
            setOpen(false);
        } else if (state.error) {
            showToast("error", "Algo pasó mal");
            // toast("Error en la acción: " + state.error);
            console.error("Error en la acción: ", state.error);
        }
    }, [state, router, setOpen, type]);

    return (
        <form
            className="flex flex-col gap-8"
            onSubmit={(e) => {
                e.stopPropagation();
                onSubmit(e);
            }}
        >
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
                    defaultValue={data?.usuario?.nombre}
                    register={register}
                    error={errors.nombre}
                />
                <InputField
                    label="Apellido del paciente"
                    name="apellido"
                    defaultValue={data?.usuario?.apellido}
                    register={register}
                    error={errors?.apellido}
                />
                <div className="flex flex-col gap-2 w-full md:w-1/2">
                    <InputField
                        label="DNI"
                        name="dni"
                        defaultValue={data?.usuario?.dni}
                        register={register}
                        error={errors.dni}
                    />
                    <InputField
                        label="Teléfono"
                        name="telefono"
                        defaultValue={data?.usuario?.telefono}
                        register={register}
                        error={errors?.telefono}
                    />
                    <label className="text-xs text-gray-500">Sexo</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("sexo")}
                        defaultValue={data?.usuario?.sexo}
                    >
                        <option value="MASCULINO">Masculino</option>
                        <option value="FEMENINO">Femenino</option>
                    </select>
                    {errors.sexo?.message && (
                        <p className="text-xs text-red-400">{errors.sexo.message.toString()}</p>
                    )}
                    <InputField
                        label="Fecha de nacimiento"
                        name="fecha_nacimiento"
                        defaultValue={
                            data?.fecha_nacimiento
                                ? new Date(data.fecha_nacimiento).toISOString().slice(0, 10)
                                : ""
                        }
                        register={register}
                        error={errors.fecha_nacimiento}
                        type="date"
                    />
                </div>
            </div>
            {state.error && <span className="text-red-400">Algo pasó mal</span>}
            <button type="submit" className="bg-backbuttondefault text-white p-2 rounded-md">
                {type === "create" ? "Crear" : "Actualizar"}
            </button>
        </form>
    );
};

export default PatientForm;
