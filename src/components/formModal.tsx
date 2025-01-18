"use client";
import Image from "next/image"
import { Dispatch, JSX, SetStateAction, useActionState, useEffect, useState } from "react";
import AppointmentForm from "@/components/forms/appointmentForm";
import { deleteAppointment } from "@/lib/serverActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormContainerProps } from "./formContainer";

const forms: {
    [key: string]: (setOpen: Dispatch<SetStateAction<boolean>>, type: "create" | "update", data?: any, relatedData?: any) => JSX.Element;
} = {
    cita: (setOpen, type, data, relatedData) =>
        <AppointmentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
};

const deleteActions = {
    cita: deleteAppointment,
    paciente: deleteAppointment,
    empleado: deleteAppointment,
};

const FormModal = ({
    table, type, data, id, relatedData,
}: FormContainerProps & { relatedData?: any }) => {

    const size = type === "create" ? "w-auto px-4 py-2" : "w-7 h-7";
    const bgColor = type === "create" ? "bg-sky-200" : type === "update" ? "bg-cyan-100" : type === "view" ? "bg-indigo-200" : "bg-red-100";

    const [open, setOpen] = useState(false);

    const Form = () => {

        const [state, formAction] = useActionState(deleteActions[table], { success: false, error: false });

        const router = useRouter();

        useEffect(() => {
            if (state.success) {
                toast(`La ${table} a sido eliminada`);
                setOpen(false);
                router.refresh();
            }
        }, [state, router]);


        return type === "delete" && id ? (
            <form action={formAction} className="p-4 flex flex-col gap-4">
                <input type="text | number" name="id" defaultValue={id} hidden />
                <span className="text-center font-medium">
                    ¿Está seguro de eliminar esta {table}?
                </span>
                <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
                    Eliminar
                </button>
            </form>
        ) : type === "create" || type === "update" ? (
            forms[table](setOpen, type, data, relatedData)
        ) : (
            "Formulario no encontrado"
        );
    };

    return (
        <>
            <button
                className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
                onClick={() => setOpen(true)}
            >
                <Image src={`/${type}.png`} alt="" width={type === "create" ? 14 : 18} height={type === "create" ? 14 : 18} />
                {type === "create" && <span className="ml-2 text-sm font-medium">Agregar</span>}
            </button>

            {open && (
                <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                        <Form />
                        <div
                            className="absolute top-4 right-4 cursor-pointer"
                            onClick={() => setOpen(false)}
                        >
                            <Image src="/close.png" alt="" width={14} height={14} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default FormModal