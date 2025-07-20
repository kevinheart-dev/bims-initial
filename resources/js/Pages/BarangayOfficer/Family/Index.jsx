import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import ActionMenu from "@/components/ActionMenu"; // your custom action component
import {
    HousePlus,
    Search,
    SquarePen,
    Trash2,
    User,
    UserPlus,
    UserRoundPlus,
    UsersRound,
} from "lucide-react";
import DynamicTable from "@/Components/DynamicTable";
import { useState } from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    FAMILY_TYPE_TEXT,
    INCOME_BRACKET_TEXT,
    INCOME_BRACKETS,
} from "@/constants";
import ClearFilterButton from "@/Components/ClearFiltersButton";

export default function Index({ families, queryParams = null, puroks }) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Families",
            href: route("family.index"),
            showOnMobile: true,
        },
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
        router.get(route("family.index", queryParams));
    };

    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };

    const allColumns = [
        { key: "family_id", label: "Family ID" },
        { key: "name", label: "Name of Family Head" },
        { key: "family_name", label: "Family Name" },
        { key: "income_bracket", label: "Income Bracket" },
        { key: "income_category", label: "Income Category" },
        { key: "family_type", label: "Family Type" },
        { key: "family_member_count", label: "Members" },
        { key: "house_number", label: "House Number" },
        { key: "purok_number", label: "Purok Number" },
        { key: "actions", label: "Actions" },
    ];

    const handleEdit = (id) => {
        // Your edit logic here
    };

    const handleDelete = (id) => {
        // Your delete logic here
    };

    const viewFamily = (id) => {
        router.get(route("family.showfamily", id));
    };

    const columnRenderers = {
        family_id: (row) => row?.id ?? "Unknown",

        name: (row) => {
            const head = row?.latest_head;
            if (!head?.firstname || !head?.lastname) return "No name available";
            return [head.firstname, head.middlename, head.lastname, head.suffix]
                .filter(Boolean)
                .join(" ");
        },

        family_name: (row) => (
            <Link
                href={route("family.showfamily", row?.id ?? 0)}
                className="hover:text-blue-500 hover:underline"
            >
                {(row?.family_name ?? "Unnamed") + " Family"}
            </Link>
        ),

        family_member_count: (row) => (
            <span className="flex items-center">
                {row?.members_count ?? 0} <User className="ml-2 h-5 w-5" />
            </span>
        ),

        income_bracket: (row) => {
            const bracketKey = row?.income_bracket;
            const bracketText = INCOME_BRACKET_TEXT?.[bracketKey];
            const bracketMeta = INCOME_BRACKETS?.[bracketKey];

            return bracketText ? (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                        bracketMeta?.className ?? ""
                    }`}
                >
                    {bracketText}
                </span>
            ) : (
                <span className="text-gray-500 italic">Unknown</span>
            );
        },

        income_category: (row) => {
            const bracketMeta = INCOME_BRACKETS?.[row?.income_bracket];

            return bracketMeta ? (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${bracketMeta.className}`}
                >
                    {bracketMeta.label}
                </span>
            ) : (
                <span className="text-gray-500 italic">Unknown</span>
            );
        },

        family_type: (row) => FAMILY_TYPE_TEXT?.[row?.family_type] ?? "Unknown",

        house_number: (row) => {
            const houseNumber =
                row?.latest_head?.household_residents?.[0]?.household
                    ?.house_number;
            return houseNumber ?? "Unknown";
        },

        purok_number: (row) =>
            row?.latest_head?.street?.purok?.purok_number ?? "Unknown",

        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(row?.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDelete(row?.id),
                    },
                    {
                        label: "View Family",
                        icon: <UsersRound className="w-4 h-4 text-blue-600" />,
                        onClick: () => viewFamily(row?.id),
                    },
                ]}
            />
        ),
    };

    return (
        <AdminLayout>
            <Head title="Family" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div className="pt-4">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4">
                        {/* <pre>{JSON.stringify(families, undefined, 3)}</pre> */}
                        <div className="my-1 mb-3 flex justify-between items-center">
                            <div className="flex w-full justify-end items-end space-x-1">
                                {/* Search Bar */}
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex w-full max-w-sm items-center space-x-1"
                                >
                                    <Input
                                        type="text"
                                        placeholder="Search for Family Name or House Number"
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
                                <Link href={route("family.create")}>
                                    <Button className="bg-blue-700 hover:bg-blue-500 ">
                                        <UserPlus />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <DynamicTable
                            passedData={families}
                            allColumns={allColumns}
                            columnRenderers={columnRenderers}
                            queryParams={queryParams}
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

                                    {/* family type */}
                                    <Select
                                        onValueChange={(value) =>
                                            searchFieldName("famtype", value)
                                        }
                                        value={queryParams.famtype}
                                    >
                                        <SelectTrigger className="w-[170px]">
                                            <SelectValue placeholder="Family Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">
                                                All
                                            </SelectItem>
                                            <SelectItem value="nuclear">
                                                Nuclear
                                            </SelectItem>
                                            <SelectItem value="single_parent">
                                                Single-Parent
                                            </SelectItem>
                                            <SelectItem value="extended">
                                                Extended
                                            </SelectItem>
                                            <SelectItem value="stepfamilies">
                                                Separated
                                            </SelectItem>
                                            <SelectItem value="grandparent">
                                                Grandparent
                                            </SelectItem>
                                            <SelectItem value="childless">
                                                Childless
                                            </SelectItem>
                                            <SelectItem value="cohabiting_partners">
                                                Cohabiting Partners
                                            </SelectItem>
                                            <SelectItem value="one_person_household">
                                                One-Person Household
                                            </SelectItem>
                                            <SelectItem value="roommates">
                                                Roommates
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* household head */}
                                    <Select
                                        onValueChange={(value) =>
                                            searchFieldName(
                                                "household_head",
                                                value
                                            )
                                        }
                                        value={queryParams.household_head}
                                    >
                                        <SelectTrigger className="w-[170px]">
                                            <SelectValue placeholder="Is Household Head" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">
                                                All
                                            </SelectItem>
                                            <SelectItem value="1">
                                                Head
                                            </SelectItem>
                                            <SelectItem value="0">
                                                Not Head
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {/* household head */}
                                    <Select
                                        onValueChange={(value) =>
                                            searchFieldName(
                                                "income_bracket",
                                                value
                                            )
                                        }
                                        value={queryParams.income_bracket}
                                    >
                                        <SelectTrigger className="w-[170px]">
                                            <SelectValue placeholder="Income Bracket" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">
                                                All
                                            </SelectItem>
                                            {Object.entries(
                                                INCOME_BRACKETS
                                            ).map(([key, { label }]) => (
                                                <SelectItem
                                                    key={key}
                                                    value={key}
                                                >
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex justify-end">
                                    <ClearFilterButton
                                        routeName={"family.index"}
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
