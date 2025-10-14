import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { Toaster, toast } from "sonner";
import BarangayProfileForm from "@/Components/BarangayProfileForm"; // import the form component
import { useState } from "react";

export default function Index({ barangay }) {
    const breadcrumbs = [
        { label: "Barangay Information", showOnMobile: false },
        { label: "Profile", showOnMobile: false },
    ];

    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        barangay_name: barangay.barangay_name || "",
        city: barangay.city || "",
        province: barangay.province || "",
        zip_code: barangay.zip_code || "",
        contact_number: barangay.contact_number || "",
        area_sq_km: barangay.area_sq_km || "",
        email: barangay.email || "",
        founded_year: barangay.founded_year || "",
        barangay_code: barangay.barangay_code || "",
        barangay_type: barangay.barangay_type || "",
        logo_path: null,
        _method: "PUT",
    });

    // Submit handler
    const submit = (e) => {
        e.preventDefault();

        post(route("barangay_profile.update", barangay.id), {
            onSuccess: () => {
                toast.success("Barangay profile updated successfully!", {
                    description: "The changes have been saved.",
                    duration: 3000,
                    closeButton: true,
                });
            },
            onError: (errs) => {
                const errorList = Object.values(errs).map(
                    (msg, i) => `<div key=${i}>${msg}</div>`
                );

                toast.error("Validation Error", {
                    description: (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: errorList.join(""),
                            }}
                        />
                    ),
                    duration: 4000,
                    closeButton: true,
                });
            },
        });
    };

    return (
        <AdminLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Barangay Profile
                </h2>
            }
        >
            <Head title="Barangay Profile" />
            <Toaster richColors />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <BarangayProfileForm
                        className="bg-white p-6 rounded-xl shadow"
                        data={data}
                        setData={setData}
                        errors={errors}
                        submit={submit}
                        processing={processing}
                        recentlySuccessful={recentlySuccessful}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
