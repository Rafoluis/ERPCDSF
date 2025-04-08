import { fetchRelatedData } from "@/lib/fetchRelatedData";
import FormModal from "./formModal";

export type FormContainerProps = {
    table: "cita" | "paciente" | "empleado" | "boleta" | "servicio" | "doctor";
    type: "create" | "update" | "delete" | "view";
    data?: any;
    id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
    const relatedData = await fetchRelatedData(table, type, data);

    return (
        <div>
            <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
        </div>
    );
};

export default FormContainer;
