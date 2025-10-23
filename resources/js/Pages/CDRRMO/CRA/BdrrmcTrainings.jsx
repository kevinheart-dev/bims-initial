import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import DynamicTable from "@/Components/DynamicTable";
import TableSection from "@/Components/TableSection";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { Archive } from "lucide-react";

export default function BdrrmcTrainings({
    trainingData = [],
    barangays = [],
    selectedBarangay,
    tip,
}) {
    const breadcrumbs = [
        { label: "CRA", showOnMobile: true },
        { label: "BDRRMC Trainings", showOnMobile: true },
    ];

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.bdrrmcTrainings"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const selectedBarangayName =
        barangays.find((b) => b.id == selectedBarangay)?.name || "Unknown";

    const isDataNull = !trainingData || trainingData.length === 0;

    return (
        <AdminLayout>
            <Head title="BDRRMC Trainings" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    {/* Barangay Filter */}
                    <BarangayFilterCard
                        selectedBarangay={selectedBarangay}
                        handleBarangayChange={handleBarangayChange}
                        barangays={barangays}
                    />

                    {/* No data */}
                    {isDataNull ? (
                        <div className="w-full px-2 sm:px-4 lg:px-6">
                            <NoDataPlaceholder
                                tip={
                                    tip ||
                                    "Select a barangay to view BDRRMC trainings."
                                }
                            />
                        </div>
                    ) : (
                        (() => {
                            const tableRows = trainingData
                                .filter(
                                    (b) => b.barangay_id === selectedBarangay
                                )
                                .flatMap((barangay) =>
                                    barangay.trainings.map(
                                        (training, index) => ({
                                            number: index + 1,
                                            title: training.title,
                                            status: training.status,
                                            duration: training.duration,
                                            agency: training.agency,
                                            inclusive_dates:
                                                training.inclusive_dates,
                                            number_of_participants:
                                                training.number_of_participants,
                                            participants: training.participants,
                                        })
                                    )
                                );

                            const allColumns = [
                                { key: "number", label: "No." },
                                { key: "title", label: "Training Title" },
                                { key: "status", label: "Status" },
                                { key: "duration", label: "Duration" },
                                { key: "agency", label: "Agency" },
                                {
                                    key: "inclusive_dates",
                                    label: "Inclusive Dates",
                                },
                                {
                                    key: "number_of_participants",
                                    label: "Participants",
                                },
                                {
                                    key: "participants",
                                    label: "Participants Names",
                                },
                            ];

                            const columnRenderers = {};
                            allColumns.forEach((col) => {
                                columnRenderers[col.key] = (row) => {
                                    if (col.key === "status") {
                                        return (
                                            <span
                                                className={`font-bold ${
                                                    row.status === "checked"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {row.status === "checked"
                                                    ? "Completed"
                                                    : "Not Yet"}
                                            </span>
                                        );
                                    }
                                    return <span>{row[col.key]}</span>;
                                };
                            });

                            return (
                                <TableSection
                                    icon={<Archive />}
                                    color="green"
                                    title={`BDRRMC Trainings - Barangay ${selectedBarangayName}`}
                                    description={`List of BDRRMC trainings conducted in this barangay`}
                                    tableProps={{
                                        component: DynamicTable,
                                        passedData: tableRows,
                                        allColumns,
                                        columnRenderers,
                                        visibleColumns: allColumns.map(
                                            (c) => c.key
                                        ),
                                        showTotal: false,
                                        tableHeight: "700px",
                                    }}
                                />
                            );
                        })()
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
