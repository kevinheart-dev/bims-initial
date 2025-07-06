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
} from "lucide-react";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Toaster, toast } from "sonner";
import ResidentTable from "@/Components/ResidentTable";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import ResidentFilterBar from "@/Components/ResidentFilterBar";
import { HOUSEHOLD_CONDITION_TEXT, HOUSING_CONDITION_COLOR } from "@/constants";

export default function Index({ households, puroks, queryParams }) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Households Table", showOnMobile: true },
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
        router.get(route("resident.index", queryParams));
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
        { key: "name", label: "Name of Household Head" },
        { key: "house_number", label: "House Number" },
        { key: "purok_number", label: "Purok" },
        { key: "street_name", label: "Street" },
        { key: "ownership_type", label: "Ownership Type" },
        { key: "ownership_details", label: "Ownership Details" },
        { key: "housing_condition", label: "Housing Condition" },
        { key: "year_established", label: "Year Established" },
        { key: "house_structure", label: "House Structure" },
        { key: "number_of_rooms", label: "Number of Rooms" },
        { key: "number_of_floors", label: "Number of Floors" },
        { key: "actions", label: "Actions" },
    ];

    const columnRenderers = {
        id: (house) => house.id,
        name: (house) => {
            const head = house.residents?.[0];
            return head ? (
                <Link
                    href={route("resident.show", head.id)}
                    className="hover:text-blue-500 hover:underline"
                >
                    {head.firstname} {head.middlename ?? ""}{" "}
                    {head.lastname ?? ""}
                </Link>
            ) : (
                <span className="text-gray-500 italic">No household head</span>
            );
        },
        house_number: (house) => house.house_number ?? "N/A",
        purok_number: (house) => `Purok ${house.purok.purok_number}`,
        street_name: (house) => `Street ${house.street.street_name}`,
        ownership_type: (house) => (
            <span className="capitalize">{house.ownership_type}</span>
        ),
        ownership_details: (house) => (
            <span className="text-sm text-gray-700">
                {house.ownership_details}
            </span>
        ),
        housing_condition: (house) => (
            <span
                className={`px-2 py-1 text-sm rounded-lg ${
                    HOUSING_CONDITION_COLOR[house.housing_condition] ??
                    "bg-gray-100 text-gray-700"
                }`}
            >
                {HOUSEHOLD_CONDITION_TEXT[house.housing_condition]}
            </span>
        ),
        year_established: (house) => house.year_established ?? "Unknown",
        house_structure: (house) => (
            <span className="capitalize">{house.house_structure}</span>
        ),
        number_of_rooms: (house) => house.number_of_rooms ?? "N/A",
        number_of_floors: (house) => house.number_of_floors ?? "N/A",
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

    // // Determine if showing all or paginated by checking queryParams.all
    // const [showAll, setShowAll] = useState(queryParams.all === "true");

    // // Update showAll state if queryParams change (for sync)
    // useEffect(() => {
    //     setShowAll(queryParams.all === "true");
    // }, [queryParams.all]);

    // // Toggle handler to switch all param and reload
    // const toggleShowAll = () => {
    //     let newQueryParams = { ...queryParams };

    //     if (showAll) {
    //         // Currently showing all, remove 'all' param to go back to paginated
    //         delete newQueryParams.all;
    //     } else {
    //         // Currently paginated, add 'all=true'
    //         newQueryParams.all = "true";
    //     }

    //     // Remove page param so it resets
    //     if (newQueryParams.page) {
    //         delete newQueryParams.page;
    //     }

    //     setShowAll(!showAll);
    //     router.get(route("resident.index", newQueryParams), {
    //         preserveState: true,
    //         replace: true,
    //     });
    // };

    return (
        <AdminLayout>
            <Head title="Resident Dashboard" />
            <div>
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                {/* <pre>{JSON.stringify(households, undefined, 2)}</pre> */}
                <div className="p-2 md:p-4">
                    <div className="overflow-x bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-2 my-4">
                        <div className="my-1 mb-3 flex justify-between items-center">
                            <div className="flex w-full max-w-sm items-center space-x-1">
                                <Link href={route("household.create")}>
                                    <Button className="bg-blue-700 hover:bg-blue-400 ">
                                        <HousePlus /> Add a Household
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
                                        placeholder="Search House Number"
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
                            passedData={households}
                            allColumns={allColumns}
                            columnRenderers={columnRenderers}
                        >
                            {/* add filters here */}
                        </DynamicTable>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
