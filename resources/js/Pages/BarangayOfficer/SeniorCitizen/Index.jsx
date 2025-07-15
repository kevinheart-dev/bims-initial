import ActionMenu from "@/Components/ActionMenu";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DynamicTable from "@/Components/DynamicTable";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { HousePlus, Search, SquarePen, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import ClearFilterButton from "@/Components/ClearFiltersButton";

export default function Index({ seniorCitizens, puroks, queryParams = null }) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Senior Citizen", showOnMobile: true },
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
        router.get(route("senior_citizen.index", queryParams));
    };

    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };

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

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Senior Name" },
        { key: "birthdate", label: "Birthdate" },
        { key: "age", label: "Age" },
        { key: "osca_id_number", label: "OSCA Number" },
        { key: "is_pensioner", label: "Is Pensioner?" },
        { key: "pension_type", label: "Pension Type" },
        { key: "living_alone", label: "Living Alone" },
        { key: "purok_number", label: "Purok" },
        { key: "registered_senior", label: "Is Registered Senior?" },
        { key: "actions", label: "Actions" },
    ];

    const columnRenderers = {
        id: (resident) => resident.id,
        name: (resident) => {
            return (
                <Link
                    href={route("resident.show", resident.id)}
                    className="hover:text-blue-500 hover:underline"
                >
                    {resident.firstname} {resident.middlename ?? ""}{" "}
                    {resident.lastname ?? ""}
                    {resident.suffix ? `, ${resident.suffix}` : ""}
                </Link>
            );
        },
        birthdate: (resident) => {
            const date = resident.birthdate;
            if (!date) return <span className="text-gray-400 italic">N/A</span>;

            const birthdate = new Date(date);
            return birthdate.toLocaleDateString("en-PH", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        },
        age: (resident) => {
            const birthdate = resident.birthdate;
            return calculateAge(birthdate);
        },
        osca_id_number: (resident) =>
            resident.seniorcitizen?.osca_id_number ? (
                <span className="text-gray-800">
                    {resident.seniorcitizen.osca_id_number}
                </span>
            ) : (
                <span className="text-gray-400 italic">Not Assigned</span>
            ),
        is_pensioner: (resident) =>
            resident.seniorcitizen?.is_pensioner?.toLowerCase() === "yes" ? (
                <span className="text-green-600 font-medium">Yes</span>
            ) : (
                <span className="text-gray-500">No</span>
            ),
        pension_type: (resident) =>
            resident.seniorcitizen?.pension_type ? (
                <span className="text-gray-800">
                    {resident.seniorcitizen.pension_type}
                </span>
            ) : (
                <span className="text-gray-400 italic">None</span>
            ),
        living_alone: (resident) =>
            resident.seniorcitizen?.living_alone == 1 ? (
                <span className="text-red-600 font-medium">Yes</span>
            ) : (
                <span className="text-gray-500">No</span>
            ),
        purok_number: (resident) => (
            <span className="text-gray-800">{resident.purok_number}</span>
        ),
        registered_senior: (resident) =>
            resident.seniorcitizen ? (
                <span className="text-green-600 font-medium">Yes</span>
            ) : (
                <div className="flex items-center gap-2">
                    <span className="text-red-500 italic">No</span>
                    <Link
                        href={route("senior_citizen.create", {
                            resident_id: resident.id,
                        })}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                    >
                        Register
                    </Link>
                </div>
            ),

        actions: (resident) => (
            <ActionMenu
                actions={[
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(resident.seniorcitizen.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDelete(resident.seniorcitizen.id),
                    },
                ]}
            />
        ),
    };

    const pensionTypes = [
        { label: "SSS", value: "SSS" },
        { label: "GSIS", value: "GSIS" },
        { label: "DSWD", value: "DSWD" },
        { label: "Private", value: "private" },
        { label: "None", value: "none" },
    ];

    const months = [
        { label: "January", value: "1" },
        { label: "February", value: "2" },
        { label: "March", value: "3" },
        { label: "April", value: "4" },
        { label: "May", value: "5" },
        { label: "June", value: "6" },
        { label: "July", value: "7" },
        { label: "August", value: "8" },
        { label: "September", value: "9" },
        { label: "October", value: "10" },
        { label: "November", value: "11" },
        { label: "December", value: "12" },
    ];

    return (
        <AdminLayout>
            <Head title="Senior Citizen" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div className="p-2 md:p-4">
                {/* <pre>{JSON.stringify(seniorCitizens, undefined, 3)}</pre> */}
                <div className="overflow-x bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-2 my-4">
                    <div className="my-1 mb-3 flex justify-between items-center">
                        <div className="flex w-full max-w-sm items-center space-x-1">
                            <Link href={route("senior_citizen.create")}>
                                <Button className="bg-blue-700 hover:bg-blue-400 ">
                                    <UserPlus /> Add a Senior
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
                                    placeholder="Search a Name"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
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
                        passedData={seniorCitizens}
                        allColumns={allColumns}
                        columnRenderers={columnRenderers}
                        showTotal={true}
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
                                        <SelectItem value="All">All</SelectItem>
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

                                {/* is pensioner */}
                                <Select
                                    onValueChange={(value) =>
                                        searchFieldName("is_pensioner", value)
                                    }
                                    value={queryParams.is_pensioner}
                                >
                                    <SelectTrigger className="w-[125px]">
                                        <SelectValue placeholder="Is Pensioner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All</SelectItem>

                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                        <SelectItem value="pending">
                                            Pending
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* pension type */}
                                <Select
                                    onValueChange={(value) =>
                                        searchFieldName("pension_type", value)
                                    }
                                    value={queryParams.pension_type}
                                >
                                    <SelectTrigger className="w-[125px]">
                                        <SelectValue placeholder="Pension Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All</SelectItem>

                                        {pensionTypes.map((pentype, index) => (
                                            <SelectItem
                                                key={index}
                                                value={pentype.value}
                                            >
                                                {pentype.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* is living alone */}
                                <Select
                                    onValueChange={(value) =>
                                        searchFieldName("living_alone", value)
                                    }
                                    value={queryParams.living_alone}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Type of Living" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All</SelectItem>

                                        <SelectItem value="1">Alone</SelectItem>
                                        <SelectItem value="0">
                                            Not Alone
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* months of birthdays */}
                                <Select
                                    onValueChange={(value) =>
                                        searchFieldName("birth_month", value)
                                    }
                                    value={queryParams.birth_month}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Birth Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All</SelectItem>
                                        {months.map((month, index) => (
                                            <SelectItem
                                                key={index}
                                                value={month.value}
                                            >
                                                {month.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end">
                                <ClearFilterButton
                                    link={"senior_citizen.index"}
                                />
                            </div>
                        </div>
                    </DynamicTable>
                </div>
            </div>
        </AdminLayout>
    );
}
