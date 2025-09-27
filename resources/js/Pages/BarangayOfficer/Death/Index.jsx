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
    Cross,
    MoveRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Toaster, toast } from "sonner";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import {
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
import useResidentChangeHandler from "@/hooks/handleResidentChange";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import InputField from "@/Components/InputField";

export default function Index({ deaths, puroks, queryParams, residents }) {
    const breadcrumbs = [
        { label: "Resident Information", showOnMobile: false },
        { label: "Deaths", showOnMobile: true },
    ];
    queryParams = queryParams || {};
    const APP_URL = useAppUrl();
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [recordToDelete, setRecordToDelete] = useState(null); //delete
    const [deathDetails, setDeathDetails] = useState(null); //delete

    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [selectedResident, setSelectedResident] = useState(null);

    const calculateAgeAtDeath = (birthdate, dateOfDeath) => {
        if (!birthdate || !dateOfDeath) return "Unknown";

        const birth = new Date(birthdate);
        const death = new Date(dateOfDeath);

        let age = death.getFullYear() - birth.getFullYear();
        const m = death.getMonth() - birth.getMonth();

        if (m < 0 || (m === 0 && death.getDate() < birth.getDate())) {
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
        router.get(route("death.index", queryParams));
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
        { key: "sex", label: "Sex" },
        { key: "age", label: "Age of Death" },
        { key: "birthdate", label: "Date of Birth" },
        { key: "date_of_death", label: "Date of Death" },
        { key: "purok_number", label: "Purok Number" },
        { key: "actions", label: "Actions" },
    ];
    const residentsList = residents.map((res) => ({
        label: `${res.firstname} ${res.middlename} ${res.lastname} ${res.suffix ?? ""
            }`,
        value: res.id.toString(),
    }));
    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.map((col) => col.key)
    );
    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            ["purok", "sex", "age_group", "date_of_death"].includes(key) &&
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
        id: (row) => (
            <span className="text-xs font-semibold text-gray-500">
                {row.id}
            </span>
        ),

        name: (row) => {
            return (
                <span className="font-medium text-gray-800">
                    {row.firstname} {row.middlename ?? ""} {row.lastname}{" "}
                    <span className="text-gray-500">{row.suffix ?? ""}</span>
                </span>
            );
        },

        sex: (row) => {
            const genderKey = row?.sex;
            const label =
                RESIDENT_GENDER_TEXT2?.[genderKey] ?? genderKey ?? "Unknown";
            const className =
                RESIDENT_GENDER_COLOR_CLASS?.[genderKey] ??
                "bg-gray-100 text-gray-800";

            return (
                <span
                    className={`py-1 px-3 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap ${className}`}
                >
                    {label}
                </span>
            );
        },

        birthdate: (row) =>
            row.birthdate ? (
                <span className="text-gray-700 text-sm">
                    {new Date(row.birthdate).toLocaleDateString()}
                </span>
            ) : (
                <span className="italic text-gray-400">—</span>
            ),

        age: (row) => {
            const age = calculateAgeAtDeath(row.birthdate, row.date_of_death);

            if (age === null)
                return <span className="italic text-gray-400">Unknown</span>;

            return (
                <div className="flex flex-col text-sm">
                    <span className="font-bold text-indigo-700">{age} yrs</span>
                    {age > 60 && (
                        <span className="text-xs text-rose-500 font-semibold mt-0.5">
                            Senior Citizen
                        </span>
                    )}
                </div>
            );
        },

        date_of_death: (row) =>
            row.date_of_death ? (
                <span className="text-red-600 font-medium">
                    {new Date(row.date_of_death).toLocaleDateString()}
                </span>
            ) : (
                <span className="italic text-gray-400">—</span>
            ),

        purok_number: (row) => (
            <span className="text-gray-700 font-medium">
                {row.purok_number ?? "—"}
            </span>
        ),

        actions: (record) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: <Eye className="w-4 h-4 text-indigo-600" />,
                        onClick: () => handleView(record.id),
                    },
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(record.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(record.id),
                    },
                ]}
            />
        ),
    };

    // add
    const { data, setData, post, errors, reset, clearErrors } = useForm({
        resident_id: null,
        resident_name: "",
        resident_image: null,
        birthdate: null,
        purok_number: null,
        date_of_death: new Date().toISOString().split("T")[0], // default today
        death_id: null,
        _method: undefined,
    });
    const handleResidentChange = useResidentChangeHandler(residents, setData);
    const handleAddDeath = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        post(route("death.store"), {
            onError: (errors) => {
                // console.error("Validation Errors:", errors);
                const errorList = Object.values(errors).map(
                    (msg, i) => `<div key=${i}> ${msg}</div>`
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
    const handleEditSubmit = (e) => {
        e.preventDefault();
        post(route("death.update", data.death_id), {
            onError: () => {
                // console.error("Validation Errors:", errors);
                const errorList = Object.values(errors).map(
                    (msg, i) => `<div key=${i}> ${msg}</div>`
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

    const handleModalClose = () => {
        setModalState(null);
        setIsModalOpen(false);
        setSelectedResident(null);
        setDeathDetails(null);
        reset();
        clearErrors();
    };

    const handleEdit = async (id) => {
        setModalState("add");
        setDeathDetails(null);
        try {
            const response = await axios.get(`${APP_URL}/death/details/${id}`);
            const details = response.data.details;
            setDeathDetails(details);
            setData("resident_id", details.id);
            setData(
                "resident_name",
                `${details.firstname} ${details.middlename} ${details.lastname
                } ${details.suffix ?? ""}`
            );
            setData("purok_number", details.purok_number);
            setData("birthdate", details.birthdate);
            setData("resident_image", details.resident_picture_path);
            setData("date_of_death", details.date_of_death);
            setData("death_id", details.id);
            setData("_method", "PUT");
        } catch (error) {
            console.error("Error fetching placeholders:", error);

            // Default message
            let title = "Error";
            let description = "Something went wrong. Please try again.";

            // ✅ Handle Laravel validation errors (422 status)
            if (
                error.response?.status === 422 &&
                error.response?.data?.errors
            ) {
                title = "Validation Error";

                const errorList = Object.values(
                    error.response.data.errors
                ).flat();

                description = (
                    <ul className="list-disc ml-5">
                        {errorList.map((msg, index) => (
                            <li key={index}>{msg}</li>
                        ))}
                    </ul>
                );
            }

            toast.error(title, {
                description,
                duration: 4000,
                closeButton: true,
            });
        } finally {
            setIsModalOpen(true);
        }
    };

    const handleDeleteClick = (id) => {
        setRecordToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route("death.destroy", recordToDelete), {
            onError: (errors) => {
                //console.error("Validation Errors:", errors);
                const errorList = Object.values(errors).map(
                    (msg, i) => `<div key=${i}> ${msg}</div>`
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
        setIsDeleteModalOpen(false);
    };

    const handleView = async (resident) => {
        setModalState("view");
        try {
            const response = await axios.get(
                `${APP_URL}/resident/showresident/${resident}`
            );
            setSelectedResident(response.data.resident);
        } catch (error) {
            console.error("Error fetching placeholders:", error);
        }
        setIsModalOpen(true);
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
            <Head title="Resident Information" />
            <div>
                <Toaster richColors />
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                {/* <pre>{JSON.stringify(deaths, undefined, 2)}</pre> */}
                <div className="p-2 md:p-4">
                    <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <div className="mb-6">
                                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl shadow-sm">
                                    <div className="p-2 bg-red-100 rounded-full">
                                        <Cross className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                            Death Records
                                        </h1>
                                        <p className="text-sm text-gray-500">
                                            Maintain and monitor resident <span className="font-medium">death records</span>.
                                            Use the tools below to <span className="font-medium">search, filter, or export</span>
                                            information for reports and documentation.
                                        </p>
                                    </div>
                                </div>
                            </div>

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
                                                className="bg-blue-700 hover:bg-blue-400 "
                                                type={"button"}
                                                onClick={handleAddDeath}
                                            >
                                                <SquarePlus />
                                            </Button>
                                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                Add Resident Death
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
                                        "date_of_death",
                                    ]}
                                    puroks={puroks}
                                    showFilters={true}
                                    clearRouteName="death.index"
                                    clearRouteParams={{}}
                                />
                            )}
                            <DynamicTable
                                passedData={deaths}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                queryParams={queryParams}
                                visibleColumns={visibleColumns}
                                showTotal={true}
                            />
                        </div>
                    </div>
                </div>
                <SidebarModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    title={
                        modalState === "add"
                            ? deathDetails
                                ? "Edit Resident Death Details"
                                : "Add Resident Death Details"
                            : "View Resident Details"
                    }
                >
                    {modalState === "add" && (
                        <div className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg text-sm text-black p-4 space-y-4">
                            <form
                                onSubmit={
                                    deathDetails
                                        ? handleEditSubmit
                                        : handleAddSubmit
                                }
                            >
                                <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    Death Record -{" "}
                                    {data.resident_name || "Select a Resident"}
                                </h3>
                                <p className="text-gray-600 mb-6 text-sm">
                                    Please provide the death details of the
                                    resident, including the official date of
                                    death.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-x-4 mb-5 w-full">
                                    <div className="md:row-span-2 md:col-span-2 flex flex-col items-center space-y-2">
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
                                            className="w-32 h-32 object-cover rounded-full border border-gray-200"
                                        />
                                    </div>
                                    <div className="md:col-span-4 space-y-2">
                                        <div className="w-full">
                                            <DropdownInputField
                                                label="Full Name"
                                                name="resident_name"
                                                value={data.resident_name || ""}
                                                placeholder="Select a resident"
                                                onChange={(e) =>
                                                    handleResidentChange(e)
                                                }
                                                items={residentsList}
                                                readOnly={deathDetails}
                                            />
                                            <InputError
                                                message={errors.resident_id}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <div>
                                                <InputField
                                                    label="Birthdate"
                                                    name="birthdate"
                                                    value={data.birthdate || ""}
                                                    readOnly={true}
                                                />
                                            </div>

                                            <div>
                                                <InputField
                                                    label="Purok Number"
                                                    name="purok_number"
                                                    value={data.purok_number}
                                                    readOnly={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div>
                                                <InputField
                                                    label="Date of Death"
                                                    name="date_of_death"
                                                    type="date"
                                                    value={
                                                        data.date_of_death || ""
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "date_of_death",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full rounded-lg border-gray-300 shadow-sm
                   focus:border-indigo-500 focus:ring focus:ring-indigo-200
                   focus:ring-opacity-50 text-sm"
                                                />

                                                <InputError
                                                    message={
                                                        errors.date_of_death
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end items-center">
                                    <Button
                                        className="bg-blue-700 hover:bg-blue-400 flex justify-end "
                                        type={"submit"}
                                    >
                                        {deathDetails ? "Update" : "Add"}{" "}
                                        <MoveRight />
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                    {modalState === "view" ? (
                        selectedResident ? (
                            <PersonDetailContent person={selectedResident} />
                        ) : null
                    ) : null}
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
