
import { getEmpresa } from "@/actions/company.actions";
import CompanyForm from "@/components/forms/companyForm";

export default async function CompanyPage() {
    const result = await getEmpresa();
    if (!result.success || !result.data || result.data.length === 0) {
        return <div>No se encontró empresa</div>;
    }
    const data = result.data[0];
    return <CompanyForm data={data} />;
}
