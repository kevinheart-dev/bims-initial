import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
export default function Index({ data }) {
    return (
        <AdminLayout>
            <Head title="Resident Dashboard" />
            <div>
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 my-8">
                        household
                        <pre>{JSON.stringify(data, undefined, 3)}</pre>
                        burat
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
