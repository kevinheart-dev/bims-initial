import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Pagination from "@/Components/Pagination";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    UserRoundPlus,
    SquarePen,
    Trash2,
    Network,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import ActionMenu from "@/Components/ActionMenu";

export default function Index({ residents, queryParams = null, puroks }) {
    queryParams = queryParams || {};

    const [query, setQuery] = useState(queryParams["name"] ?? "");

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload
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

    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Residents Table", showOnMobile: true },
    ];

    return (
        <AdminLayout>
            <Head title="Resident Dashboard" />
            <div>
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 my-8">
                        <div className="my-1 flex justify-between items-center">
                            <div className="flex w-full max-w-sm items-center space-x-1">
                                <Link href={route("resident.create")}>
                                    <Button className="bg-green-700 hover:bg-green-400 ">
                                        <UserRoundPlus /> Add a Resident
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
                                        placeholder="Search"
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
                        <div className="flex w-full justify-end items-center space-x-2 my-2">
                            {/* Filter for Age group */}
                            <Select
                                onValueChange={(value) =>
                                    searchFieldName("age_group", value)
                                }
                                value={queryParams.age_group || "All"}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Age Group" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="child">
                                        0 - 12 (Child)
                                    </SelectItem>
                                    <SelectItem value="teen">
                                        13 - 17 (Teen)
                                    </SelectItem>
                                    <SelectItem value="young_adult">
                                        18 - 25 (Young Adult)
                                    </SelectItem>
                                    <SelectItem value="adult">
                                        26 - 59 (Adult)
                                    </SelectItem>
                                    <SelectItem value="senior">
                                        60+ (Senior)
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Filter for Employment Status */}
                            <Select
                                onValueChange={(value) =>
                                    searchFieldName("estatus", value)
                                }
                                value={queryParams.estatus} // Default to "All" if no value exists
                            >
                                <SelectTrigger className="w-[170px]">
                                    <SelectValue placeholder="Employment Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="student">
                                        Student
                                    </SelectItem>
                                    <SelectItem value="employed">
                                        Employed
                                    </SelectItem>
                                    <SelectItem value="unemployed">
                                        Unemployed
                                    </SelectItem>
                                    <SelectItem value="self_employed">
                                        Self Employed
                                    </SelectItem>
                                    <SelectItem value="retired">
                                        Retired
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Filter for Civil Status */}
                            <Select
                                onValueChange={(value) =>
                                    searchFieldName("cstatus", value)
                                }
                                value={queryParams.cstatus} // Default to "All" if no value exists
                            >
                                <SelectTrigger className="w-[170px]">
                                    <SelectValue placeholder="Civil Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="single">
                                        Single
                                    </SelectItem>
                                    <SelectItem value="married">
                                        Married
                                    </SelectItem>
                                    <SelectItem value="widowed">
                                        Widowed
                                    </SelectItem>
                                    <SelectItem value="separated">
                                        Separated
                                    </SelectItem>
                                    <SelectItem value="divorce">
                                        Divorce
                                    </SelectItem>
                                    <SelectItem value="anulled">
                                        Anulled
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Filter for Sex */}
                            <Select
                                onValueChange={(value) =>
                                    searchFieldName("sex", value)
                                }
                                value={queryParams.sex} // Default to "All" if no value exists
                            >
                                <SelectTrigger className="w-[105px]">
                                    <SelectValue placeholder="Sex" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">
                                        Female
                                    </SelectItem>
                                    <SelectItem value="LGBTQ+">
                                        LGBTQ+
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Filter for Purok */}
                            <Select
                                onValueChange={(value) =>
                                    searchFieldName("purok", value)
                                }
                                value={queryParams.purok} // Default to "All" if no value exists
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
                        </div>
                        <Table>
                            <TableCaption>
                                <Pagination
                                    links={residents.links}
                                    queryParams={queryParams}
                                />
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">
                                        Resident ID
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Age</TableHead>
                                    <TableHead>Civil Status</TableHead>
                                    <TableHead>Employment Status</TableHead>
                                    <TableHead>Purok</TableHead>
                                    <TableHead>Residency Date</TableHead>
                                    <TableHead className="text-center">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {residents.data.length > 0 ? (
                                    residents.data.map((resident) => (
                                        <TableRow key={resident.id}>
                                            <TableCell>{resident.id}</TableCell>
                                            <TableCell>{`${
                                                resident.firstname
                                            } ${resident.middlename ?? ""} ${
                                                resident.lastname ?? ""
                                            } ${
                                                resident.suffix ?? ""
                                            }`}</TableCell>
                                            <TableCell>
                                                {resident.gender}
                                            </TableCell>
                                            <TableCell>
                                                {resident.age}
                                            </TableCell>
                                            <TableCell>
                                                {resident.civil_status}
                                            </TableCell>
                                            <TableCell>
                                                {resident.employment_status}
                                            </TableCell>
                                            <TableCell>
                                                {resident.purok_number}
                                            </TableCell>
                                            <TableCell>
                                                {resident.residency_date}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {/* <div className="flex justify-center items-center gap-2">
                                                    <Button
                                                        className="bg-green-400 hover:bg-green-600"
                                                        size="sm"
                                                    >
                                                        <SquarePen />
                                                    </Button>
                                                    <Button
                                                        className="bg-red-500 hover:bg-red-600"
                                                        size="sm"
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={route(
                                                                        "barangay_officer.familytree",
                                                                        resident.id
                                                                    )}
                                                                >
                                                                    <Button
                                                                        className="bg-blue-400 hover:bg-blue-600"
                                                                        size="sm"
                                                                    >
                                                                        <Network />
                                                                    </Button>
                                                                </Link>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    See Family
                                                                    Tree
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div> */}
                                                <ActionMenu
                                                    actions={[
                                                        {
                                                            label: "Edit",
                                                            icon: (
                                                                <SquarePen className="w-4 h-4 text-green-500" />
                                                            ),
                                                            onClick: () =>
                                                                handleEdit(
                                                                    resident.id
                                                                ),
                                                        },
                                                        {
                                                            label: "Delete",
                                                            icon: (
                                                                <Trash2 className="w-4 h-4 text-red-600" />
                                                            ),
                                                            onClick: () =>
                                                                handleDelete(
                                                                    resident.id
                                                                ),
                                                        },
                                                        {
                                                            label: "Family Tree",
                                                            icon: (
                                                                <Network className="w-4 h-4 text-blue-500" />
                                                            ),
                                                            href: route(
                                                                "barangay_officer.familytree",
                                                                resident.id
                                                            ),
                                                            tooltip:
                                                                "See Family Tree",
                                                        },
                                                        // ➕ Add more actions here easily!
                                                    ]}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan="9"
                                            className="text-center font-semibold"
                                        >
                                            No records found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
