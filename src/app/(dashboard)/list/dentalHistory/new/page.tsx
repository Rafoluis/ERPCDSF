import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import HistoryForm from "@/components/historyForm";

export default async function NewHistoryPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user || !["ODONTOLOGO", "ADMIN"].includes(session.user.role)) {
        redirect("/404");
    }

    return (
        <div>
            <div className='rounded-md flex-1 m-4 mt-0'>
                <div className="flex items-center justify-between p-2">
                    <h1 className="hidden md:block text-lg font-semibold">Gestión de historias clínicas</h1>
                </div>
            </div>
            <HistoryForm />
        </div>

    );
}
