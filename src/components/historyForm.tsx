"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Printer, X } from "lucide-react";

type FormState = {
    id_paciente: number;
    fecha_ultima_consulta?: string;
    estado_tratamiento?: string;
    fecha_alta?: string;
};

export default function HistoryForm() {
    const router = useRouter();
    const [form, setForm] = useState<FormState>({ id_paciente: 0 });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        // e.preventDefault();
        // await fetch("/api/historia", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(form),
        // });
        // router.push("/historia");
    };

    return (
        <div>
            <div className="bg-backgrounddefault p-4 rounded-md flex-1 m-4 mt-0">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="hidden md:block text-ls font-semibold">
                        Nueva historia clínica odontológica
                    </h1>

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
                    </div>
                </div>

                <form
                    id="odontologia-form"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    <label className="block">
                        <span className="font-medium">Paciente (ID)</span>
                        <input
                            type="number"
                            name="id_paciente"
                            value={form.id_paciente}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border rounded p-2"
                        />
                    </label>

                    <label className="block">
                        <span className="font-medium">Fecha de última consulta</span>
                        <input
                            type="date"
                            name="fecha_ultima_consulta"
                            value={form.fecha_ultima_consulta || ""}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded p-2"
                        />
                    </label>

                    <label className="block">
                        <span className="font-medium">Estado del tratamiento</span>
                        <textarea
                            name="estado_tratamiento"
                            value={form.estado_tratamiento || ""}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded p-2"
                        />
                    </label>

                    <label className="block">
                        <span className="font-medium">Fecha de alta</span>
                        <input
                            type="date"
                            name="fecha_alta"
                            value={form.fecha_alta || ""}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded p-2"
                        />
                    </label>
                </form>
            </div>
        </div>
    );
}
