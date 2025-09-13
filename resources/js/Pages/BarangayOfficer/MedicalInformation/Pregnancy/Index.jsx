import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    SquarePen,
    Trash2,
    SquarePlus,
    Eye,
    RotateCcw,
    ListPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Toaster, toast } from "sonner";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import {
    MEDICAL_CONDITION_STATUS_STYLES,
    MEDICAL_CONDITION_STATUSES,
    PREGNANCY_STATUS_STYLES,
    PREGNANCY_STATUSES,
    RESIDENT_GENDER_COLOR_CLASS,
    RESIDENT_GENDER_TEXT2,
} from "@/constants";
import SidebarModal from "@/Components/SidebarModal";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import PersonDetailContent from "@/Components/SidebarModalContents/PersonDetailContent";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import InputLabel from "@/Components/InputLabel";
import DropdownInputField from "@/Components/DropdownInputField";
import InputField from "@/Components/InputField";
import useResidentChangeHandler from "@/hooks/handleResidentChange";
import InputError from "@/Components/InputError";
import SelectField from "@/Components/SelectField";
import { Textarea } from "@/Components/ui/textarea";
import {
    IoIosAddCircleOutline,
    IoIosArrowForward,
    IoIosCloseCircleOutline,
} from "react-icons/io";

export default function Index({
    pregnancy_records,
    puroks,
    queryParams,
    residents,
}) {
    const breadcrumbs = [
        { label: "Medical Information", showOnMobile: false },
        { label: "Vaccinations", showOnMobile: true },
    ];
    queryParams = queryParams || {};
    const APP_URL = useAppUrl();
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [recordToDelete, setRecordToDelete] = useState(null); //delete
    const [modalState, setModalState] = useState(null); //delete
    const [pregnancyDetails, setPregnancyDetails] = useState(null);

    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);

    const calculateAge = (birthdate) => {
        if (!birthdate) return "Unknown";
        const birth = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        searchFieldName("name", query);
    };
    const searchFieldName = (field, value) => {
        if (value && value.trim() !== "") {
            queryParams[field] = value;
        } else {
            delete queryParams[field];
        }

        if (queryParams.page) {
            delete queryParams.page;
        }
        router.get(route("pregnancy.index", queryParams));
    };
    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Resident Name" },
        { key: "age", label: "Age" },
        { key: "status", label: "Pregnancy Status" },
        { key: "expected_due_date", label: "Expected Due" },
        { key: "delivery_date", label: "Delivery Date" },
        { key: "notes", label: "Notes" },
        { key: "purok_number", label: "Purok Number" },
        { key: "actions", label: "Actions" },
    ];
    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.map((col) => col.key)
    );
    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "purok",
                "sex",
                "age_group",
                "pregnancy_status",
                "expected_due_date",
                "delivery_date",
            ].includes(key) &&
            value &&
            value !== ""
    );

    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);

    const [showFilters, setShowFilters] = useState(hasActiveFilter);
    const toggleShowFilters = () => setShowFilters((prev) => !prev);

    const handlePrint = () => {
        window.print();
    };

    const columnRenderers = {
        id: (row) => row.id,

        name: (row) => {
            const r = row.resident ?? {};
            return (
                <span>
                    {r.firstname} {r.middlename ?? ""} {r.lastname}{" "}
                    {r.suffix ?? ""}
                </span>
            );
        },

        age: (row) => {
            const age = calculateAge(row.resident?.birthdate);

            if (typeof age !== "number") return "Unknown";

            return (
                <div className="flex flex-col text-sm">
                    <span className="font-medium text-gray-800">{age}</span>
                    {age > 60 && (
                        <span className="text-xs text-rose-500 font-semibold">
                            Senior Citizen
                        </span>
                    )}
                </div>
            );
        },

        status: (row) => {
            const status = row.status ?? "default";
            return (
                <span
                    className={
                        PREGNANCY_STATUS_STYLES[status] ||
                        PREGNANCY_STATUS_STYLES.default
                    }
                >
                    {PREGNANCY_STATUSES[status] || "Unknown"}
                </span>
            );
        },

        expected_due_date: (row) =>
            row.expected_due_date
                ? new Date(row.expected_due_date).toLocaleDateString()
                : "—",

        delivery_date: (row) =>
            row.delivery_date
                ? new Date(row.delivery_date).toLocaleDateString()
                : "—",

        notes: (row) => row.notes ?? "—",

        purok_number: (row) => row.resident?.purok_number ?? "—",

        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: <Eye className="w-4 h-4 text-indigo-600" />,
                        onClick: () => handleView(row.resident?.id),
                    },
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => {
                            handleEdit(row.id);
                        },
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(row.id),
                    },
                ]}
            />
        ),
    };

    // add
    const handleAddRecord = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const { data, setData, post, errors, reset, clearErrors } = useForm({
        resident_id: null,
        resident_name: "", // (optional: if you want full name)
        resident_image: null,
        birthdate: null,
        civil_status: "",
        purok_number: null,
        pregnancy_records: [[]],
        _method: undefined,
        record_id: null,
    });

    const handleResidentChange = useResidentChangeHandler(residents, setData);
    const residentsList = residents.map((res) => ({
        label: `${res.firstname} ${res.middlename} ${res.lastname} ${
            res.suffix ?? ""
        }`,
        value: res.id.toString(),
    }));

    const addRecord = () => {
        setData("pregnancy_records", [...(data.pregnancy_records || []), {}]);
    };
    const removeRecord = (recordIdx) => {
        const updated = [...(data.pregnancy_records || [])];
        updated.splice(recordIdx, 1);
        setData("pregnancy_records", updated);
        toast.warning("Record removed.", {
            duration: 2000,
        });
    };
    // Update a specific pregnancy record field in state
    const handlePregnancyFieldChange = (value, idx, field) => {
        setData((prevData) => {
            const updated = [...prevData.pregnancy_records];

            // Ensure the record exists
            if (!updated[idx]) {
                updated[idx] = {};
            }

            updated[idx] = {
                ...updated[idx],
                [field]: value,
            };

            return { ...prevData, pregnancy_records: updated };
        });
    };
    // Submit new pregnancy record(s)
    const handleSubmitPregnancy = (e) => {
        e.preventDefault();
        post(route("pregnancy.store"), {
            onError: (errors) => {
                console.error("Validation Errors:", errors);

                const allErrors = Object.values(errors).join("<br />");
                toast.error("Validation Error", {
                    description: (
                        <span dangerouslySetInnerHTML={{ __html: allErrors }} />
                    ),
                    duration: 3000,
                    closeButton: true,
                });
            },
            onSuccess: () => {
                handleModalClose(); // close modal if using one
            },
        });
    };

    // edit
    const handleEdit = async (id) => {
        setModalState("edit");

        try {
            // Fetch pregnancy record details
            const response = await axios.get(
                `${APP_URL}/pregnancy/details/${id}`
            );

            const record = response.data.record;
            setPregnancyDetails(record);
            // Populate form data
            setData({
                resident_id: record.resident_id || null,
                resident_name: record.resident
                    ? `${record.resident.firstname} ${
                          record.resident.middlename ?? ""
                      } ${record.resident.lastname} ${
                          record.resident.suffix ?? ""
                      }`.trim()
                    : "",
                resident_image: record.resident?.resident_picture_path || null,
                birthdate: record.resident?.birthdate || null,
                sex: record.resident?.sex || "",
                purok_number: record.resident?.purok_number || null,
                pregnancy_records: [
                    {
                        status: record.status || "",
                        expected_due_date: record.expected_due_date || "",
                        delivery_date: record.delivery_date || "",
                        notes: record.notes || "",
                    },
                ],
                _method: "PUT",
                record_id: record.id,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching pregnancy record details:", error);
        }
    };
    const handleUpdatePregnancy = (e) => {
        e.preventDefault();
        post(route("pregnancy.update", data.record_id), {
            onError: (errors) => {
                //console.error("Validation Errors:", errors);

                const allErrors = Object.values(errors).join("<br />");
                toast.error("Validation Error", {
                    description: (
                        <span dangerouslySetInnerHTML={{ __html: allErrors }} />
                    ),
                    duration: 3000,
                    closeButton: true,
                });
            },
            onSuccess: () => {
                handleModalClose();
            },
        });
    };

    // delete
    const handleDeleteClick = (id) => {
        setRecordToDelete(id);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = () => {
        router.delete(route("pregnancy.destroy", recordToDelete), {
            onError: (errors) => {
                console.error("Validation Errors:", errors);

                const allErrors = Object.values(errors).join("<br />");
                toast.error("Validation Error", {
                    description: (
                        <span dangerouslySetInnerHTML={{ __html: allErrors }} />
                    ),
                    duration: 3000,
                    closeButton: true,
                });
            },
        });
        setIsDeleteModalOpen(false);
    };

    const handleView = async (resident) => {
        try {
            const response = await axios.get(
                `${APP_URL}/resident/showresident/${resident}`
            );
            setSelectedResident(response.data.resident);
        } catch (error) {
            console.error("Error fetching placeholders:", error);
        }
        setIsModalOpen(true);
        setModalState("view");
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedResident(null);
        setPregnancyDetails(null);
        setModalState(null);
        reset();
        clearErrors();
    };

    useEffect(() => {
        if (success) {
            handleModalClose();
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
            <Head title="Medical Information" />
            <div>
                <Toaster richColors />
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                {/* <pre>{JSON.stringify(pregnancy_records, undefined, 2)}</pre> */}
                <div className="p-2 md:p-4">
                    <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <div className="flex flex-wrap items-start justify-between gap-2 w-full mb-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <DynamicTableControls
                                        allColumns={allColumns}
                                        visibleColumns={visibleColumns}
                                        setVisibleColumns={setVisibleColumns}
                                        onPrint={handlePrint}
                                        showFilters={showFilters}
                                        toggleShowFilters={() =>
                                            setShowFilters((prev) => !prev)
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2 flex-wrap justify-end">
                                    <form
                                        onSubmit={handleSearchSubmit}
                                        className="flex w-[380px] max-w-lg items-center space-x-1"
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Search Resident Name"
                                            value={query}
                                            onChange={(e) =>
                                                setQuery(e.target.value)
                                            }
                                            onKeyDown={(e) =>
                                                onKeyPressed(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full"
                                        />
                                        <div className="relative group z-50">
                                            <Button
                                                type="submit"
                                                className="border active:bg-blue-900 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white flex items-center gap-2 bg-transparent"
                                                variant="outline"
                                            >
                                                <Search />
                                            </Button>
                                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                Search
                                            </div>
                                        </div>
                                        <div className="relative group z-50">
                                            <Button
                                                variant="outline"
                                                className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                                type={"button"}
                                                onClick={handleAddRecord}
                                            >
                                                <ListPlus />
                                            </Button>
                                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                Add Pregnancy Records
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={[
                                        "purok",
                                        "sex",
                                        "age_group",
                                        "pregnancy_status",
                                        "expected_due_date",
                                        "delivery_date",
                                    ]}
                                    puroks={puroks}
                                    showFilters={true}
                                    clearRouteName="pregnancy.index"
                                    clearRouteParams={{}}
                                />
                            )}
                            <DynamicTable
                                passedData={pregnancy_records}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                queryParams={queryParams}
                                visibleColumns={visibleColumns}
                                setVisibleColumns={setVisibleColumns}
                            />
                        </div>
                    </div>
                </div>
                <SidebarModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={
                        modalState == "view"
                            ? "Resident Details"
                            : modalState == "add"
                            ? "Add Pregnancy Records"
                            : "Edit Pregnancy Record"
                    }
                >
                    {modalState == "view" && (
                        <PersonDetailContent person={selectedResident} />
                    )}
                    {modalState != "view" && (
                        <form
                            className="bg-gray-50 p-4 rounded-lg"
                            onSubmit={
                                pregnancyDetails
                                    ? handleUpdatePregnancy
                                    : handleSubmitPregnancy
                            }
                        >
                            <h3 className="text-2xl font-medium text-gray-700">
                                Pregnancy Record
                            </h3>
                            <p className="text-sm text-gray-500 mb-8">
                                Please provide details about the pregnancy
                                record for the selected resident.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-x-4 mb-5">
                                <div className="md:row-span-2 flex flex-col md:col-span-2 items-center space-y-2">
                                    <InputLabel
                                        htmlFor={`resident_image`}
                                        value="Profile Photo"
                                    />
                                    <img
                                        src={
                                            data.resident_image
                                                ? `/storage/${data.resident_image}`
                                                : "/images/default-avatar.jpg"
                                        }
                                        alt={`Resident Image`}
                                        className="w-32 h-32 object-cover rounded-sm border border-gray-200"
                                    />
                                </div>
                                <div className="md:col-span-4 space-y-2">
                                    <div className="w-full">
                                        <DropdownInputField
                                            label="Full Name"
                                            name="fullname"
                                            value={data.resident_name || ""}
                                            placeholder="Select a resident"
                                            onChange={(e) =>
                                                handleResidentChange(e)
                                            }
                                            items={residentsList}
                                        />
                                        <InputError
                                            message={errors.resident_id}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <div>
                                            <InputField
                                                label="Birthdate"
                                                name="birthdate"
                                                value={data.birthdate || ""}
                                                placeholder="Select a resident"
                                                readOnly={true}
                                            />
                                        </div>

                                        <div>
                                            <InputField
                                                label="Sex"
                                                name="sex"
                                                value={
                                                    RESIDENT_GENDER_TEXT2[
                                                        data.sex || ""
                                                    ]
                                                }
                                                placeholder="Select a resident"
                                                readOnly={true}
                                            />
                                        </div>
                                        <div>
                                            <InputField
                                                label="Purok"
                                                name="purok_number"
                                                value={data.purok_number || ""}
                                                readOnly={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {Array.isArray(data.pregnancy_records) &&
                                data.pregnancy_records.map((record, idx) => (
                                    <div
                                        key={idx}
                                        className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-6 mb-6 gap-4">
                                            {/* Status */}
                                            <div className="md:col-span-2">
                                                <SelectField
                                                    label="Status"
                                                    name="status"
                                                    value={record.status || ""}
                                                    onChange={(e) =>
                                                        handlePregnancyFieldChange(
                                                            e.target.value,
                                                            idx,
                                                            "status"
                                                        )
                                                    }
                                                    items={[
                                                        {
                                                            label: "Ongoing",
                                                            value: "ongoing",
                                                        },
                                                        {
                                                            label: "Delivered",
                                                            value: "delivered",
                                                        },
                                                        {
                                                            label: "Miscarried",
                                                            value: "miscarried",
                                                        },
                                                        {
                                                            label: "Aborted",
                                                            value: "aborted",
                                                        },
                                                    ]}
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `pregnancyRecords.${idx}.status`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>

                                            {/* Expected Due Date */}
                                            <div className="md:col-span-2">
                                                <InputField
                                                    label="Expected Due Date"
                                                    type="date"
                                                    name="expected_due_date"
                                                    value={
                                                        record.expected_due_date ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handlePregnancyFieldChange(
                                                            e.target.value,
                                                            idx,
                                                            "expected_due_date"
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `pregnancyRecords.${idx}.expected_due_date`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>

                                            {/* Delivery Date */}
                                            <div className="md:col-span-2">
                                                <InputField
                                                    label="Delivery Date"
                                                    type="date"
                                                    name="delivery_date"
                                                    value={
                                                        record.delivery_date ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handlePregnancyFieldChange(
                                                            e.target.value,
                                                            idx,
                                                            "delivery_date"
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `pregnancyRecords.${idx}.delivery_date`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>

                                            {/* Notes */}
                                            <div className="md:col-span-6">
                                                <Textarea
                                                    label="Notes"
                                                    name="notes"
                                                    value={record.notes || ""}
                                                    onChange={(e) =>
                                                        handlePregnancyFieldChange(
                                                            e.target.value,
                                                            idx,
                                                            "notes"
                                                        )
                                                    }
                                                    placeholder="Additional notes..."
                                                    className="text-gray-600"
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `pregnancyRecords.${idx}.notes`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        {pregnancyDetails === null && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeRecord(idx)
                                                }
                                                className="absolute top-1 right-2 flex items-center gap-1 text-sm text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                            >
                                                <IoIosCloseCircleOutline className="text-2xl" />
                                            </button>
                                        )}
                                    </div>
                                ))}

                            <div className="flex justify-between items-center p-3">
                                {pregnancyDetails === null ? (
                                    <button
                                        type="button"
                                        onClick={addRecord}
                                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
                                    >
                                        <IoIosAddCircleOutline className="text-2xl" />
                                        <span>Add Pregnancy Record</span>
                                    </button>
                                ) : (
                                    <div></div>
                                )}

                                <div className="flex justify-end items-center text-end mt-5 gap-4">
                                    {pregnancyDetails == null && (
                                        <Button
                                            type="button"
                                            onClick={() => reset()}
                                        >
                                            <RotateCcw /> Reset
                                        </Button>
                                    )}

                                    <Button
                                        className="bg-blue-700 hover:bg-blue-400"
                                        type={"submit"}
                                    >
                                        {pregnancyDetails ? "Update" : "Add"}{" "}
                                        <IoIosArrowForward />
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}
                </SidebarModal>
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
