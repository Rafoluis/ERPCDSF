"use client";
import Image from "next/image";
import { Dispatch, JSX, SetStateAction, useActionState, useEffect, useState } from "react";
import AppointmentForm from "@/components/forms/appointmentForm";
import PatientForm from "./forms/patientForms";
import TicketForm from "./forms/ticketForm";
import ServiceForm from "./forms/serviceForm";
import DoctorForm from "./forms/doctorsForms";
import { deleteAppointment } from "@/actions/appointment.actions";
import { deletePatient } from "@/actions/patient.actions";
import { deleteTicket } from "@/actions/ticket.actions";
import { deleteService } from "@/actions/service.actions";
import { deleteDoctor } from "@/actions/doctor.actions";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { showToast } from "@/lib/toast";
import { FormContainerProps } from "./formContainer";
import { Eye, Pencil, Plus, Trash2, UserRoundPlus } from "lucide-react";
import TableAction from "@/components/table/TableAction";

interface ExtendedFormModalProps extends FormContainerProps {
    relatedData?: any;
    onSuccess?: any;
    variant?: "appointment" | "default";
}

const forms: {
    [key: string]: (
        setOpen: Dispatch<SetStateAction<boolean>>,
        type: "create" | "update",
        data?: any,
        relatedData?: any,
        onSuccess?: any
    ) => JSX.Element;
} = {
    cita: (setOpen, type, data, relatedData) => (
        <AppointmentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
    paciente: (setOpen, type, data, relatedData, onSuccess) => (
        <PatientForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} onSuccess={onSuccess} />
    ),
    boleta: (setOpen, type, data, relatedData) => (
        <TicketForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
    servicio: (setOpen, type, data, relatedData) => (
        <ServiceForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
    doctor: (setOpen, type, data, relatedData) => (
        <DoctorForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
    ),
};

const deleteActions: Record<string, any> = {
    cita: deleteAppointment,
    paciente: deletePatient,
    boleta: deleteTicket,
    servicio: deleteService,
    doctor: deleteDoctor,
};

export default function FormModal({
    table,
    type,
    data,
    id,
    relatedData,
    onSuccess,
    variant = "default",
}: ExtendedFormModalProps) {
    const isAppointmentPatient = table === "paciente" && type === "create" && variant === "appointment";
    const router = useRouter();
    const [open, setOpen] = useState(false);

    function Form() {
        const [state, formAction] = useActionState(deleteActions[table], { success: false, error: null });

        useEffect(() => {
            if (state.success) {
                showToast("success", `La ${table} ha sido eliminada`);
                setOpen(false);
                router.refresh();
            }
        }, [state.success, router, table]);

        if (type === "delete" && id) {
            return (
                <form action={formAction} className="p-4 flex flex-col gap-4">
                    <input type="hidden" name="id" value={id} />
                    <span className="text-center font-medium">¿Está seguro de eliminar esta {table}?</span>
                    <button className="bg-red-700 text-white py-2 px-4 rounded-md w-max self-center">Eliminar</button>
                </form>
            );
        }

        if (type === "create" || type === "update") {
            return forms[table](setOpen, type, data, relatedData, onSuccess);
        }

        return <span>Formulario no encontrado</span>;
    }

    if (type === "create") {
        return (
            <>
                <button
                    type="button"
                    className={`${isAppointmentPatient ? "w-full px-4 py-2 rounded-md bg-backbuttondefault" : "w-auto px-4 py-2 rounded-full bg-backbuttondefault"
                        } flex items-center justify-center`}
                    onClick={() => setOpen(true)}
                >
                    {isAppointmentPatient ? (
                        <UserRoundPlus size={20} color="white" />
                    ) : (
                        <>
                            <Plus size={20} color="white" />
                            <span className="ml-2 text-sm font-medium text-textdefault">Agregar</span>
                        </>
                    )}
                </button>
                {open && renderModal()}
            </>
        );
    }

    const isUpdate = type === "update";
    const isDelete = type === "delete";

    return (
        <>
            {isUpdate && (
                <TableAction
                    icon={<Pencil />}
                    onClick={() => setOpen(true)}
                    className="shadow-sm hover:shadow-md bg-cyan-100 hover:bg-cyan-200"
                    iconColor="text-black"
                    hoverIconColor="text-black"
                    iconSize="w-4 h-4"
                />
            )}
            {isDelete && (
                <TableAction
                    icon={<Trash2 />}
                    onClick={() => setOpen(true)}
                    className="shadow-sm hover:shadow-md bg-red-100 hover:bg-red-200"
                    iconColor="text-black"
                    hoverIconColor="text-black"
                    iconSize="w-4 h-4"
                />
            )}
            {open && renderModal()}
        </>
    );

    function renderModal() {
        return createPortal(
            <div
                className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
                onClick={() => setOpen(false)}
            >
                <div
                    className="bg-white p-6 rounded-md relative w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Form />
                    <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setOpen(false)}>
                        <Image src="/close.png" alt="Cerrar" width={14} height={14} />
                    </div>
                </div>
            </div>,
            document.body
        );
    }
}
