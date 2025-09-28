import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Pencil, Trash2, ArrowUpCircle, FileOutput } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

export default function Show({ blotter_details }) {
    const breadcrumbs = [
        { label: "Katarungang Pambarangay", showOnMobile: false },
        {
            label: "Blotter Reports",
            href: route("blotter_report.index"),
            showOnMobile: false,
        },
        { label: "View Blotter Report", showOnMobile: true },
    ];
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [recordToDelete, setRecordToDelete] = useState(null); //delete
    const renderParticipants = (participants, role) => {
        const filtered =
            participants?.filter((p) => p.role_type === role) || [];

        if (filtered.length === 0) {
            return <p className="text-gray-500 italic">No {role}s recorded.</p>;
        }

        return (
            <ul className="list-disc list-inside space-y-1">
                {filtered.map((p, i) => {
                    const displayName = p.resident
                        ? `${p.resident.firstname} ${p.resident.lastname}`
                        : p.name || "Unknown";

                    return (
                        <li key={i}>
                            <span className="font-medium">{displayName}</span>
                            {p.notes && (
                                <span className="ml-2 text-sm text-gray-600">
                                    ({p.notes})
                                </span>
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    };
    // delete
    const handleDeleteClick = (id) => {
        setRecordToDelete(id);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = () => {
        router.delete(route("blotter_report.destroy", recordToDelete));
        setIsDeleteModalOpen(false);
    };

    const handleGenerateForm = async () => {
        try {
            const response = await axios.get(
                route("blotter_report.generateForm", blotter_details.id),
                { responseType: "blob" }
            );

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;

            // try to use filename from server headers, otherwise fallback
            const contentDisposition = response.headers["content-disposition"];
            const match = contentDisposition?.match(/filename="?([^"]+)"?/);
            const filename = match ? match[1] : "blotter_report.docx";

            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success("Form generated successfully", {
                duration: 3000,
                className: "bg-green-100 text-green-800",
            });
        } catch (error) {
            console.error("Form generation failed:", error);

            let serverMessage =
                "An unexpected error occurred. Please try again.";

            if (error.response) {
                if (error.response.data?.message) {
                    serverMessage = error.response.data.message;
                } else if (error.response.status === 404) {
                    serverMessage = "The requested report could not be found.";
                } else if (error.response.status === 500) {
                    serverMessage =
                        "A server error occurred while generating the form.";
                } else {
                    serverMessage = `Server responded with status ${error.response.status}.`;
                }
            } else if (error.request) {
                serverMessage =
                    "No response from server. Please check your internet connection.";
            } else {
                serverMessage = `Request failed: ${error.message}`;
            }

            toast.error("Failed to generate form", {
                description: serverMessage,
                duration: 6000,
                className: "bg-red-100 text-red-800",
                closeButton: true,
            });
        }
    };

    const handleEdit = (id) => {
        router.get(route("blotter_report.edit", id));
    };

    // feedback
    useEffect(() => {
        if (success) {
            toast.success(success, {
                description: "Operation successful!",
                duration: 3000,
                closeButton: true,
            });
        }
        props.success = null;
    }, [success]);
    useEffect(() => {
        if (error) {
            toast.error(error, {
                description: "Operation failed!",
                duration: 3000,
                closeButton: true,
            });
        }
        props.error = null;
    }, [error]);
    return (
        <AdminLayout>
            <Head title="View Blotter Report" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster richColors />
            {/* <pre>{JSON.stringify(blotter_details, undefined, 2)}</pre> */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <Card className="shadow-sm border rounded-xl">
                    {/* Header with Title + Actions */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <div>
                            <h2 className="text-3xl font-semibold text-gray-800 mb-1">
                                Blotter Report Details
                            </h2>
                            <p className="text-sm text-gray-600">
                                Review the details of this incident report.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(blotter_details.id)}
                            >
                                <Pencil className="w-4 h-4 mr-1" />
                                Edit
                            </Button>

                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                    handleDeleteClick(blotter_details.id)
                                }
                            >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                            </Button>
                            <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-white"
                                onClick={handleGenerateForm}
                            >
                                <FileOutput className="w-4 h-4 mr-1" />
                                Generate Form
                            </Button>
                            <Button
                                size="sm"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                onClick={() =>
                                    router.visit(
                                        route(
                                            "summon.elevate",
                                            blotter_details.id
                                        )
                                    )
                                }
                            >
                                <ArrowUpCircle className="w-4 h-4 mr-1" />
                                Elevate to Summon
                            </Button>
                        </div>
                    </div>

                    {/* Body */}
                    <CardContent className="p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-600">
                                    Type of Incident
                                </h4>
                                <p className="text-base text-gray-900">
                                    {blotter_details?.type_of_incident || "-"}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-600">
                                    Incident Date
                                </h4>
                                <p className="text-base text-gray-900">
                                    {blotter_details?.incident_date || "-"}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-600">
                                    Location
                                </h4>
                                <p className="text-base text-gray-900">
                                    {blotter_details?.location || "-"}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-600">
                                    Report Status
                                </h4>
                                <Badge className="capitalize">
                                    {blotter_details?.report_status ||
                                        "pending"}
                                </Badge>
                            </div>
                        </div>

                        {/* Recorded By */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-600">
                                    Recorded By
                                </h4>
                                <p className="text-base text-gray-900">
                                    {blotter_details?.recorded_by?.resident
                                        ? `${
                                              blotter_details.recorded_by
                                                  .resident.firstname
                                          } ${
                                              blotter_details.recorded_by
                                                  .resident.middlename || ""
                                          } ${
                                              blotter_details.recorded_by
                                                  .resident.lastname
                                          }`
                                        : "-"}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-600">
                                    Official Position
                                </h4>
                                <p className="text-base text-gray-900 capitalize">
                                    {blotter_details?.recorded_by?.position ||
                                        "-"}
                                </p>
                            </div>
                        </div>

                        {/* Narrative */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-600 mb-1">
                                Narrative Details
                            </h4>
                            <p className="whitespace-pre-line text-gray-800">
                                {blotter_details?.narrative_details || "-"}
                            </p>
                        </div>

                        {/* Actions Taken */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-600 mb-1">
                                Actions Taken
                            </h4>
                            <p className="whitespace-pre-line text-gray-800">
                                {blotter_details?.actions_taken || "-"}
                            </p>
                        </div>

                        {/* Resolution */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-600 mb-1">
                                Resolution
                            </h4>
                            <p className="whitespace-pre-line text-gray-800">
                                {blotter_details?.resolution || "-"}
                            </p>
                        </div>

                        {/* Recommendations */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-600 mb-1">
                                Recommendations
                            </h4>
                            <p className="whitespace-pre-line text-gray-800">
                                {blotter_details?.recommendations || "-"}
                            </p>
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-500">
                            <p>
                                <span className="font-medium">Created At:</span>{" "}
                                {blotter_details?.created_at
                                    ? new Date(
                                          blotter_details.created_at
                                      ).toLocaleString()
                                    : "-"}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Last Updated:
                                </span>{" "}
                                {blotter_details?.updated_at
                                    ? new Date(
                                          blotter_details.updated_at
                                      ).toLocaleString()
                                    : "-"}
                            </p>
                        </div>

                        {/* Participants */}
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-700">
                                    Complainants
                                </h4>
                                {renderParticipants(
                                    blotter_details?.complainants,
                                    "complainant"
                                )}
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-700">
                                    Respondents
                                </h4>
                                {renderParticipants(
                                    blotter_details?.respondents,
                                    "respondent"
                                )}
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-700">
                                    Witnesses
                                </h4>
                                {renderParticipants(
                                    blotter_details?.witnesses,
                                    "witness"
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                    }}
                    onConfirm={confirmDelete}
                    residentId={recordToDelete}
                />
            </div>
        </AdminLayout>
    );
}
