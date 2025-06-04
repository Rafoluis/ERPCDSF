"use client";
import Image from "next/image";
import { Dispatch, JSX, SetStateAction, useActionState, useEffect, useRef, useState } from "react";
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
import ConfirmCloseModal from "./ConfirmCloseModal"; 

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
  const [showConfirm, setShowConfirm] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleRequestClose = () => setShowConfirm(true);
  const handleConfirmClose = () => {
    setShowConfirm(false);
    setOpen(false);
  };
  const handleCancelClose = () => setShowConfirm(false);

  const wideWidth = "w-full max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-5xl";
  const defaultWidth = "w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%]";
  const widthClasses = table === "cita" || table === "boleta" ? wideWidth : defaultWidth;

  const isCreate = type === "create";
  const isUpdate = type === "update";
  const isDelete = type === "delete";

  const formRef = useRef(
    type === "delete" && id ? (
      <DeleteForm table={table} id={String(id)} setOpen={setOpen} />
    ) : (
      forms[table](setOpen, type as any, data, relatedData, onSuccess)
    )
  );

  return (
    <>
      {isCreate && (
        <button
          type="button"
          className={`${
            isAppointmentPatient
              ? "w-full px-4 py-2 rounded-md bg-backbuttondefault hover:bg-backbuttonhover"
              : "w-auto px-4 py-2 rounded-full bg-backbuttondefault hover:bg-backbuttonhover"
          } flex items-center justify-center`}
          onClick={handleOpen}
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
      )}

      {!isCreate && isUpdate && (
        <TableAction
          icon={<Pencil />}
          onClick={handleOpen}
          className="shadow-sm hover:shadow-md bg-cyan-100 hover:bg-cyan-200"
          iconColor="text-black"
          hoverIconColor="text-black"
          iconSize="w-4 h-4"
        />
      )}
      {!isCreate && isDelete && (
        <TableAction
          icon={<Trash2 />}
          onClick={handleOpen}
          className="shadow-sm hover:shadow-md bg-red-100 hover:bg-red-200"
          iconColor="text-black"
          hoverIconColor="text-black"
          iconSize="w-4 h-4"
        />
      )}

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center">
          <div
            className={`bg-white p-6 rounded-md relative ${widthClasses} z-50`}
            onClick={(e) => e.stopPropagation()}
          >
            {formRef.current}
            <div className="absolute top-4 right-4 cursor-pointer" onClick={handleRequestClose}>
              <Image src="/close.png" alt="Cerrar" width={14} height={14} />
            </div>
          </div>
        </div>
      )}

      {showConfirm && <ConfirmCloseModal onConfirm={handleConfirmClose} onCancel={handleCancelClose} />}
    </>
  );
}

function DeleteForm({ table, id, setOpen }: { table: string; id: string; setOpen: any }) {
  const [state, formAction] = useActionState(deleteActions[table], { success: false, error: null });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      showToast("success", `La ${table} ha sido eliminada`);
      setOpen(false);
      router.refresh();
    }
  }, [state.success, router, setOpen, table]);

  return (
    <form action={formAction} className="p-4 flex flex-col gap-4">
      <input type="hidden" name="id" value={id} />
      <span className="text-center font-medium">¿Está seguro de eliminar esta {table}?</span>
      <button className="bg-red-700 text-white py-2 px-4 rounded-md w-max self-center">Eliminar</button>
    </form>
  );
}
