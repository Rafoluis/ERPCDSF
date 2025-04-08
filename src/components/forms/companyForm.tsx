"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "@/components/inputField";
import { empresaSchema, EmpresaSchema } from "@/schemas/company.schema";
import { startTransition, useActionState } from "react";
import { useEffect } from "react";
import { updateEmpresa } from "@/actions/company.actions";
import { showToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

interface CompanyFormProps {
    data: EmpresaSchema;
}

const CompanyForm = ({ data }: CompanyFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<EmpresaSchema>({
        resolver: zodResolver(empresaSchema),
        defaultValues: data,
    });

    const [state, formAction] = useActionState(updateEmpresa, {
        success: false,
        error: null,
    });
    const router = useRouter();

    // Actualiza el formulario cuando los datos cambien.
    useEffect(() => {
        reset(data);
    }, [data, reset]);

    const onSubmit = handleSubmit((formData) => {
        if (!formData || !formData.id_empresa) {
            showToast("error", "No se pudo encontrar la empresa para actualizar.");
            return;
        }
        startTransition(() => {
            formAction(formData);
        });
    });

    useEffect(() => {
        if (state.success) {
            showToast("success", "La empresa ha sido actualizada");
            router.refresh();
        } else if (state.error) {
            showToast("error", state.error);
            console.error("Error en la acción:", state.error);
        }
    }, [state, router]);

    return (
        <div>
            <div className="rounded-md flex-1 m-4 mt-0">
                <div className="flex items-center justify-between p-2">
                    <h1 className="hidden md:block text-lg font-semibold">
                        Gestión de empresa
                    </h1>
                </div>
            </div>
            <div className="bg-backgrounddefault p-4 rounded-md flex-1 m-4 mt-0  w-1/2">
                <form onSubmit={onSubmit} className="flex flex-wrap gap-4">
                    <InputField
                        label="Nombre de la Empresa"
                        name="razon_social"
                        register={register}
                        error={errors.razon_social}
                    />
                    <InputField
                        label="RUC"
                        name="ruc"
                        register={register}
                        error={errors.ruc}
                    />
                    <InputField
                        label="Nombre Comercial"
                        name="nombre_comercial"
                        register={register}
                        error={errors.nombre_comercial}
                    />
                    <InputField
                        label="Dirección"
                        name="domicilio_fiscal"
                        register={register}
                        error={errors.domicilio_fiscal}
                    />
                    <InputField
                        label="Ubigeo"
                        name="ubigeo"
                        register={register}
                        error={errors.ubigeo}
                    />
                    <InputField
                        label="Actividad Económica"
                        name="actividad_economica"
                        register={register}
                        error={errors.actividad_economica}
                    />
                    <InputField
                        label="Tipo de Contribuyente"
                        name="tipo_contribuyente"
                        register={register}
                        error={errors.tipo_contribuyente}
                    />
                    <InputField
                        label="Clave SOL"
                        name="clave_sol"
                        register={register}
                        error={errors.clave_sol}
                    />
                    <InputField
                        label="Teléfono"
                        name="telefono"
                        type="tel"
                        register={register}
                        error={errors.telefono}
                    />
                    <InputField
                        label="Email"
                        name="email"
                        type="email"
                        register={register}
                        error={errors.email}
                    />
                    <div className="w-full flex justify-center items-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm w-auto"
                        >
                            Actualizar empresa
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default CompanyForm;
