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

    return (
        <AdminLayout>
            <Head title="Resident Dashboard" />
            <div>
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
                            <div className="flex w-full max-w-sm items-center space-x-1">
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex w-full max-w-sm items-center space-x-1 mr-6"
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
                                    />
                                    <Button type="submit">
                                        <Search />
                                    </Button>
                                </form>

                                <Select
                                    onValueChange={(value) =>
                                        searchFieldName("purok", value)
                                    }
                                    value={queryParams.purok} // Default to "All" if no value exists
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Purok" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All</SelectItem>
                                        {puroks.map((purok, index) => (
                                            <SelectItem
                                                key={index}
                                                value={purok.id.toString()}
                                            >
                                                Purok {purok.purok_number}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
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
                                    <TableHead>Civil Status</TableHead>
                                    <TableHead>Employment Status</TableHead>
                                    <TableHead>Residency Date</TableHead>
                                    <TableHead className="text-center">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {residents.length > 0 ? (
                                    residents.data.map((resident) => (
                                        <TableRow key={resident.id}>
                                            <TableCell>{resident.id}</TableCell>
                                            <TableCell>{`${
                                                resident.firstname
                                            } ${resident.middlename ?? ""} ${
                                                resident.lastname ?? ""
                                            }`}</TableCell>
                                            <TableCell>
                                                {resident.gender}
                                            </TableCell>
                                            <TableCell>
                                                {resident.civil_status}
                                            </TableCell>
                                            <TableCell>
                                                {resident.employment_status}
                                            </TableCell>
                                            <TableCell>
                                                {resident.residency_date}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center items-center gap-2">
                                                    <Button
                                                        className="bg-green-400 hover:bg-green-600 "
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
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableCell
                                        colspan="7"
                                        className="text-center font-semibold"
                                    >
                                        No records found.
                                    </TableCell>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
