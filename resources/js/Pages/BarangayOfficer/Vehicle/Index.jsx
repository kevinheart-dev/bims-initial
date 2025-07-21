import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SquarePen, Trash2, SquarePlus, MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Toaster, toast } from "sonner";
import ResidentTable from "@/Components/ResidentTable";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import {
    HOUSEHOLD_CONDITION_TEXT,
    HOUSEHOLD_OWNERSHIP_TEXT,
    HOUSEHOLD_STRUCTURE_TEXT,
    HOUSING_CONDITION_COLOR,
    VEHICLE_CLASS_TEXT,
    VEHICLE_USAGE_TEXT,
    VEHICLE_USAGE_STYLES,
} from "@/constants";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import ClearFilterButton from "@/Components/ClearFiltersButton";
import SidebarModal from "@/Components/SidebarModal";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import InputLabel from "@/Components/InputLabel";

export default function Index({
    vehicles,
    vehicle_types,
    puroks,
    queryParams,
    residents,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Vehicles", showOnMobile: true },
    ];
    queryParams = queryParams || {};

    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, errors } = useForm({
        resident_id: null,
        resident_name: "",
        resident_image: null,
        birthdate: null,
        purok_number: null,
        has_vehicle: null,
        vehicles: [[]],
    });
    const handleArrayValues = (e, index, column, array) => {
        const updated = [...(data[array] || [])];
        updated[index] = {
            ...updated[index],
            [column]: e.target.value,
        };
        setData(array, updated);
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
        router.get(route("vehicle.index", queryParams));
    };
    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };
    const addVehicle = () => {
        setData("vehicles", [...(data.vehicles || []), {}]);
    };
    const removeVehicle = (vehicleIndex) => {
        const updated = [...(data.vehicles || [])];
        updated.splice(vehicleIndex, 1);
        setData("vehicles", updated);
    };
    const allColumns = [
        { key: "id", label: "Vehicle ID" },
        { key: "name", label: "Owner Name" },
        { key: "vehicle_type", label: "Vehicle Type" },
        { key: "vehicle_class", label: "Class" },
        { key: "usage_status", label: "Usage" },
        { key: "quantity", label: "Quantity" },
        { key: "purok_number", label: "Purok Number" },
        { key: "actions", label: "Actions" },
    ];
    const columnRenderers = {
        id: (row) => row.vehicle_id,

        name: (row) => (
            <span>
                {row.firstname} {row.middlename ?? ""} {row.lastname}{" "}
                {row.suffix ?? ""}
            </span>
        ),

        vehicle_type: (row) => (
            <span className="capitalize">{row.vehicle_type}</span>
        ),

        vehicle_class: (row) => VEHICLE_CLASS_TEXT[row.vehicle_class],

        usage_status: (row) => {
            const statusLabel = VEHICLE_USAGE_TEXT[row.usage_status];
            return (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        VEHICLE_USAGE_STYLES[row.usage_status]
                    }`}
                >
                    {statusLabel}
                </span>
            );
        },

        quantity: (row) => row.quantity,

        purok_number: (row) => row.purok_number,
        actions: (house) => (
            <ActionMenu
                actions={[
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(house.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDelete(house.id),
                    },
                ]}
            />
        ),
    };
    const handleAddVehicle = () => {
        setIsModalOpen(true);
    };
    const handleResidentChange = (e) => {
        const resident_id = Number(e.target.value);
        const resident = residents.find((r) => r.id == resident_id);
        if (resident) {
            setData("resident_id", resident.id);
            setData(
                "resident_name",
                `${resident.firstname} ${resident.middlename} ${
                    resident.lastname
                } ${resident.suffix ?? ""}`
            );
            setData("purok_number", resident.purok_number);
            setData("birthdate", resident.birthdate);
            setData("resident_image", resident.resident_picture_path);
        }
    };
    const residentsList = residents.map((res) => ({
        label: `${res.firstname} ${res.middlename} ${res.lastname} ${
            res.suffix ?? ""
        }`,
        value: res.id.toString(),
    }));

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("vehicle.store"), {
            onError: (errors) => {
                console.error("Validation Errors:", errors);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Vehicles" />
            <div>
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                {/* <pre>{JSON.stringify(vehicles, undefined, 2)}</pre> */}
                <div className="p-2 md:p-4">
                    <div className="overflow-x bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-2 my-4">
                        <div className="my-1 mb-3 flex justify-between items-center">
                            <div className="flex w-full justify-end items-end space-x-1">
                                {/* Search Bar */}
                                <form
                                    onSubmit={handleSearchSubmit}
                                    className="flex w-full max-w-sm items-center space-x-1"
                                >
                                    <Input
                                        type="text"
                                        placeholder="Search Owner's Name"
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            onKeyPressed("name", e.target.value)
                                        }
                                        className="ml-4"
                                    />
                                    <Button type="submit">
                                        <Search />
                                    </Button>
                                </form>

                                <Button
                                    className="bg-blue-700 hover:bg-blue-400 "
                                    onClick={handleAddVehicle}
                                >
                                    <SquarePlus />
                                </Button>
                            </div>
                        </div>
                        <DynamicTable
                            passedData={vehicles}
                            allColumns={allColumns}
                            columnRenderers={columnRenderers}
                        >
                            <div className="flex justify-between items-center w-full">
                                <div className="flex gap-2 w-full">
                                    {/* puroks */}
                                    <Select
                                        onValueChange={(value) =>
                                            searchFieldName("purok", value)
                                        }
                                        value={queryParams.purok}
                                    >
                                        <SelectTrigger className="w-[95px]">
                                            <SelectValue placeholder="Purok" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">
                                                All
                                            </SelectItem>
                                            {puroks.map((purok, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={purok.toString()}
                                                >
                                                    Purok {purok}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* vehicle types */}
                                    <Select
                                        onValueChange={(value) =>
                                            searchFieldName("v_type", value)
                                        }
                                        value={queryParams.v_type}
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Vehicle Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">
                                                All
                                            </SelectItem>
                                            {vehicle_types.map(
                                                (type, index) => (
                                                    <SelectItem
                                                        key={index}
                                                        value={type.toLowerCase()}
                                                    >
                                                        {type}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>

                                    {/* vehicle types */}
                                    <Select
                                        onValueChange={(value) =>
                                            searchFieldName("v_class", value)
                                        }
                                        value={queryParams.v_class}
                                    >
                                        <SelectTrigger className="w-[130px]">
                                            <SelectValue placeholder="Vehicle Class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">
                                                All
                                            </SelectItem>
                                            <SelectItem value="private">
                                                Private
                                            </SelectItem>
                                            <SelectItem value="public">
                                                Public
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* usages */}
                                    <Select
                                        onValueChange={(value) =>
                                            searchFieldName("usage", value)
                                        }
                                        value={queryParams.usage}
                                    >
                                        <SelectTrigger className="w-[135px]">
                                            <SelectValue placeholder="Vehicle Usage" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">
                                                All
                                            </SelectItem>
                                            <SelectItem value="personal">
                                                Personal
                                            </SelectItem>
                                            <SelectItem value="public_transport">
                                                Public Transport
                                            </SelectItem>
                                            <SelectItem value="business_use">
                                                Business Use
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex justify-end">
                                    <ClearFilterButton
                                        routeName={"vehicle.index"}
                                    />
                                </div>
                            </div>
                        </DynamicTable>
                        <SidebarModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            title="Add Vehicles"
                        >
                            <div className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg text-sm text-black p-4 space-y-4">
                                <form
                                    className="bg-gray-50 p-3 rounded"
                                    onSubmit={onSubmit}
                                >
                                    <h3 className="text-xl font-medium text-gray-700 mb-8">
                                        Vehicle Info
                                    </h3>
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
                                                    value={
                                                        data.resident_name || ""
                                                    }
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

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                <div>
                                                    <InputField
                                                        label="Birthdate"
                                                        name="birthdate"
                                                        value={
                                                            data.birthdate || ""
                                                        }
                                                        readOnly={true}
                                                    />
                                                </div>

                                                <div>
                                                    <InputField
                                                        label="Purok Number"
                                                        name="purok_number"
                                                        value={
                                                            data.purok_number
                                                        }
                                                        readOnly={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4 mt-4">
                                        {(data.vehicles || []).map(
                                            (vehicle, vecIndex) => (
                                                <div
                                                    key={vecIndex}
                                                    className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                                >
                                                    {/* Left: input fields */}
                                                    <div className="grid md:grid-cols-4 gap-4">
                                                        <div>
                                                            <DropdownInputField
                                                                label="Vehicle Type"
                                                                name="vehicle_type"
                                                                value={
                                                                    vehicle.vehicle_type ||
                                                                    ""
                                                                }
                                                                items={[
                                                                    "Motorcycle",
                                                                    "Tricycle",
                                                                    "Car",
                                                                    "Jeep",
                                                                    "Truck",
                                                                    "Bicycle",
                                                                ]}
                                                                onChange={(e) =>
                                                                    handleArrayValues(
                                                                        e,
                                                                        vecIndex,
                                                                        "vehicle_type",
                                                                        "vehicles"
                                                                    )
                                                                }
                                                                placeholder="Select type"
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors[
                                                                        `vehicles.${vecIndex}.vehicle_type`
                                                                    ]
                                                                }
                                                                className="mt-2"
                                                            />
                                                        </div>
                                                        <div>
                                                            <DropdownInputField
                                                                label="Classification"
                                                                name="vehicle_class"
                                                                value={
                                                                    vehicle.vehicle_class ||
                                                                    ""
                                                                }
                                                                items={[
                                                                    {
                                                                        label: "Private",
                                                                        value: "private",
                                                                    },
                                                                    {
                                                                        label: "Public",
                                                                        value: "public",
                                                                    },
                                                                ]}
                                                                onChange={(e) =>
                                                                    handleArrayValues(
                                                                        e,
                                                                        vecIndex,
                                                                        "vehicle_class",
                                                                        "vehicles"
                                                                    )
                                                                }
                                                                placeholder="Select class"
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors[
                                                                        `vehicles.${vecIndex}.vehicle_class`
                                                                    ]
                                                                }
                                                                className="mt-2"
                                                            />
                                                        </div>
                                                        <div>
                                                            <DropdownInputField
                                                                label="Usage Purpose"
                                                                name="usage_status"
                                                                value={
                                                                    vehicle.usage_status ||
                                                                    ""
                                                                }
                                                                items={[
                                                                    {
                                                                        label: "Personal",
                                                                        value: "personal",
                                                                    },
                                                                    {
                                                                        label: "Public Transport",
                                                                        value: "public_transport",
                                                                    },
                                                                    {
                                                                        label: "Business Use",
                                                                        value: "business_use",
                                                                    },
                                                                ]}
                                                                onChange={(e) =>
                                                                    handleArrayValues(
                                                                        e,
                                                                        vecIndex,
                                                                        "usage_status",
                                                                        "vehicles"
                                                                    )
                                                                }
                                                                placeholder="Select usage"
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors[
                                                                        `vehicles.${vecIndex}.usage_status`
                                                                    ]
                                                                }
                                                                className="mt-2"
                                                            />
                                                        </div>
                                                        <div>
                                                            <InputField
                                                                label="Quantity"
                                                                name="quantity"
                                                                type="number"
                                                                value={
                                                                    vehicle.quantity ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleArrayValues(
                                                                        e,
                                                                        vecIndex,
                                                                        "quantity",
                                                                        "vehicles"
                                                                    )
                                                                }
                                                                placeholder="Number"
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors[
                                                                        `vehicles.${vecIndex}.quantity`
                                                                    ]
                                                                }
                                                                className="mt-2"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Right: remove button */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeVehicle(
                                                                vecIndex
                                                            )
                                                        }
                                                        className="absolute top-1 right-2 flex items-center gap-1 text-2xl text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                                        title="Remove"
                                                    >
                                                        <IoIosCloseCircleOutline />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                        <div className="flex justify-between items-center p-3">
                                            <button
                                                type="button"
                                                onClick={() => addVehicle()}
                                                className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                                                title="Add vehicle"
                                            >
                                                <IoIosAddCircleOutline className="text-4xl" />
                                                <span className="ml-1">
                                                    Add Vehicle
                                                </span>
                                            </button>
                                            <Button
                                                className="bg-blue-700 hover:bg-blue-400 "
                                                type={"submit"}
                                            >
                                                Add <MoveRight />
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </SidebarModal>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
