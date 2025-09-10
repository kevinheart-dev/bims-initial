import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, ArrowUpCircle } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Toaster } from "sonner";
import { Head } from "@inertiajs/react";

export default function ViewBlotterReport({ blotter_details }) {
    const breadcrumbs = [
        { label: "Katarungang Pambarangay", showOnMobile: false },
        { label: "Summons", href: route("summon.index"), showOnMobile: false },
        { label: "View Summon", showOnMobile: true },
    ];

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);

    const handleEdit = (id) => console.log("Edit", id);
    const handleDeleteClick = (id) => {
        setRecordToDelete(id);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = () => {
        console.log("Deleting", recordToDelete);
        setIsDeleteModalOpen(false);
    };

    const formatDate = (date) =>
        date
            ? new Date(date).toLocaleDateString("en-US", {
                  dateStyle: "medium",
              })
            : "-";

    const groupByRole = (participants, role) =>
        participants?.filter((p) => p.role_type === role) || [];

    const renderParticipants = (list, roleLabel) =>
        list?.length ? (
            <ul className="space-y-2">
                {list.map((p) => (
                    <li
                        key={p.id}
                        className="border p-3 rounded-lg bg-gray-50 flex flex-col"
                    >
                        <span className="font-medium text-gray-800">
                            {p.display_name}
                        </span>
                        {p.resident && (
                            <span className="text-sm text-gray-600">
                                {p.resident.gender},{" "}
                                {p.resident.contact_number || "No contact"}
                            </span>
                        )}
                        {p.notes && (
                            <span className="text-xs text-gray-500 italic">
                                Notes: {p.notes}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-sm text-gray-500">No {roleLabel}s recorded.</p>
        );

    const renderInfoItem = (label, value) => (
        <div>
            <h4 className="text-sm font-medium text-gray-600">{label}</h4>
            <p className="text-sm text-gray-900">{value || "Not provided"}</p>
        </div>
    );

    const renderSection = (title, content) => (
        <div>
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1 mb-2">
                {title}
            </h4>
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                {content?.trim() || "No details provided."}
            </p>
        </div>
    );

    const statusBadge = (status) => {
        const styles = {
            resolved: "bg-green-100 text-green-700",
            pending: "bg-yellow-100 text-yellow-700",
            elevated: "bg-red-100 text-red-700",
        };
        return (
            <Badge
                className={`capitalize px-2 py-1 rounded ${
                    styles[status] || "bg-gray-200 text-gray-700"
                }`}
            >
                {status || "Unknown"}
            </Badge>
        );
    };

    return (
        <AdminLayout>
            <Head title="View Blotter Report" />
            <Toaster richColors />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <Card className="shadow-sm border rounded-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Report: {blotter_details.type_of_incident}
                            </h2>
                            <p className="text-sm text-gray-600">
                                Filed on{" "}
                                {formatDate(blotter_details.created_at)} at{" "}
                                {blotter_details.location || "Unknown location"}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(blotter_details.id)}
                            >
                                <Pencil className="w-4 h-4 mr-1" /> Edit
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                    handleDeleteClick(blotter_details.id)
                                }
                            >
                                <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </Button>
                            <Button
                                size="sm"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <ArrowUpCircle className="w-4 h-4 mr-1" />{" "}
                                Elevate
                            </Button>
                        </div>
                    </div>

                    {/* Body */}
                    <CardContent className="p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {renderInfoItem(
                                "Type of Incident",
                                blotter_details.type_of_incident
                            )}
                            {renderInfoItem(
                                "Incident Date",
                                formatDate(blotter_details.incident_date)
                            )}
                            {renderInfoItem(
                                "Location",
                                blotter_details.location
                            )}
                            <div>
                                <h4 className="text-sm font-medium text-gray-600">
                                    Report Status
                                </h4>
                                {statusBadge(blotter_details.report_status)}
                            </div>
                        </div>

                        {/* Recorded By */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {renderInfoItem(
                                "Recorded By",
                                blotter_details.recorded_by?.resident
                                    ? `${
                                          blotter_details.recorded_by.resident
                                              .firstname
                                      } ${
                                          blotter_details.recorded_by.resident
                                              .middlename || ""
                                      } ${
                                          blotter_details.recorded_by.resident
                                              .lastname
                                      }`
                                    : null
                            )}
                            {renderInfoItem(
                                "Official Position",
                                blotter_details.recorded_by?.position
                            )}
                        </div>

                        {/* Sections */}
                        {renderSection(
                            "Narrative",
                            blotter_details.narrative_details
                        )}
                        {renderSection(
                            "Actions Taken",
                            blotter_details.actions_taken
                        )}
                        {renderSection(
                            "Resolution",
                            blotter_details.resolution
                        )}
                        {renderSection(
                            "Recommendations",
                            blotter_details.recommendations
                        )}

                        {/* Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-500">
                            <p>
                                <span className="font-medium">Created At:</span>{" "}
                                {formatDate(blotter_details.created_at)}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Last Updated:
                                </span>{" "}
                                {formatDate(blotter_details.updated_at)}
                            </p>
                        </div>

                        {/* Participants */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-800">
                                Participants
                            </h4>
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-1">
                                    Complainants
                                </h5>
                                {renderParticipants(
                                    groupByRole(
                                        blotter_details.participants,
                                        "complainant"
                                    ),
                                    "complainant"
                                )}
                            </div>
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-1">
                                    Respondents
                                </h5>
                                {renderParticipants(
                                    groupByRole(
                                        blotter_details.participants,
                                        "respondent"
                                    ),
                                    "respondent"
                                )}
                            </div>
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-1">
                                    Witnesses
                                </h5>
                                {renderParticipants(
                                    groupByRole(
                                        blotter_details.participants,
                                        "witness"
                                    ),
                                    "witness"
                                )}
                            </div>
                        </div>

                        {/* Summons */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-800">
                                Summons
                            </h4>
                            {blotter_details.summons?.length ? (
                                blotter_details.summons.map((summon) => (
                                    <Card
                                        key={summon.id}
                                        className="p-4 bg-white border border-gray-200 shadow-sm rounded-lg"
                                    >
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="font-medium text-gray-700">
                                                Status:
                                            </span>
                                            {statusBadge(summon.status)}
                                        </div>
                                        <div className="text-sm text-gray-800 mt-1">
                                            <span className="font-medium">
                                                Issued By:
                                            </span>{" "}
                                            {summon.issued_by || "Unknown"}
                                        </div>

                                        <div className="mt-3">
                                            <h5 className="text-sm font-semibold text-gray-700">
                                                Hearing Sessions
                                            </h5>
                                            <ul className="space-y-2 mt-2">
                                                {summon.takes.map((session) => (
                                                    <li
                                                        key={session.id}
                                                        className="border rounded p-2 bg-gray-50"
                                                    >
                                                        <p className="text-sm text-gray-800">
                                                            <span className="font-medium">
                                                                Session{" "}
                                                                {
                                                                    session.session_number
                                                                }
                                                                :
                                                            </span>{" "}
                                                            {formatDate(
                                                                session.hearing_date
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-gray-600">
                                                            Status:{" "}
                                                            {
                                                                session.session_status
                                                            }
                                                        </p>
                                                        {session.session_remarks && (
                                                            <p className="text-xs text-gray-500 italic">
                                                                {
                                                                    session.session_remarks
                                                                }
                                                            </p>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No summons issued.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Delete Confirmation */}
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    residentId={recordToDelete}
                />
            </div>
        </AdminLayout>
    );
}
