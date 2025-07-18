import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    UserRoundPlus,
    HousePlus,
    SquarePen,
    Trash2,
    Network,
    SquarePlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Toaster, toast } from "sonner";
import ResidentTable from "@/Components/ResidentTable";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import ResidentFilterBar from "@/Components/ResidentFilterBar";
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

export default function Index({
    vehicles,
    vehicle_types,
    puroks,
    queryParams,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Veicles", showOnMobile: true },
    ];
    queryParams = queryParams || {};

    const [query, setQuery] = useState(queryParams["name"] ?? "");

    const handleSubmit = (e) => {
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

    return (
        <AdminLayout>
            <Head title="Vehicles" />
            <div>
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                {/* <pre>{JSON.stringify(vehicles, undefined, 2)}</pre> */}
                <div className="p-2 md:p-4">
                    <div className="overflow-x bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-2 my-4">
                        <div className="my-1 mb-3 flex justify-between items-center">
                            <div className="flex w-full max-w-sm items-center space-x-1">
                                <Link href={route("household.create")}>
                                    <Button className="bg-blue-700 hover:bg-blue-400 ">
                                        <SquarePlus /> Add a Vehicle
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex w-full justify-end items-end space-x-1">
                                {/* Search Bar */}
                                <form
                                    onSubmit={handleSubmit}
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
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
