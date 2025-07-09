import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableCaption,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
    SquarePen,
    Trash2,
    Network,
    Columns3,
    Rows4,
    Rows3,
    Printer,
} from "lucide-react";
import { usePage, router } from "@inertiajs/react";
import { all } from "axios";
import Pagination from "./Pagination";

const DynamicTable = ({
    passedData,
    allColumns,
    columnRenderers,
    children,
    is_paginated = false,
    toggleShowAll = null,
    showAll = null,
    queryParams = null,
    showTotal = false,
    sortable = false,
}) => {
    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.map((col) => col.key)
    );
    const contentRef = useRef();
    const reactToPrintFn = useReactToPrint({ contentRef });

    const cleanData = Array.isArray(passedData.data)
        ? passedData.data
        : passedData;

    const [sortBy, setSortBy] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");

    const handleSort = (columnKey) => {
        if (sortBy === columnKey) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(columnKey);
            setSortDirection("asc");
        }
    };

    const sortedData = [...cleanData].sort((a, b) => {
        if (!sortBy) return 0;

        const aVal = a[sortBy] ?? "";
        const bVal = b[sortBy] ?? "";

        if (typeof aVal === "number" && typeof bVal === "number") {
            return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }

        return sortDirection === "asc"
            ? String(aVal).localeCompare(String(bVal))
            : String(bVal).localeCompare(String(aVal));
    });

    return (
        <>
            {/* Column Toggle + Print */}

            <div className="flex items-center gap-4 mb-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Columns3 />
                            Select Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                            checked={
                                visibleColumns.length === allColumns.length
                            }
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    setVisibleColumns(
                                        allColumns.map((col) => col.key)
                                    );
                                }
                            }}
                        >
                            Select All
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={visibleColumns.length === 0}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    setVisibleColumns([]);
                                }
                            }}
                        >
                            Deselect All
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                        {allColumns.map((col) => (
                            <DropdownMenuCheckboxItem
                                key={col.key}
                                checked={visibleColumns.includes(col.key)}
                                onCheckedChange={() => {
                                    setVisibleColumns((prev) =>
                                        prev.includes(col.key)
                                            ? prev.filter((k) => k !== col.key)
                                            : [...prev, col.key]
                                    );
                                }}
                            >
                                {col.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                {is_paginated && (
                    <Button
                        onClick={toggleShowAll}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        {showAll ? <Rows3 /> : <Rows4 />}
                        {showAll ? "Show Paginated" : "Show Full List"}
                    </Button>
                )}
                <Button onClick={() => reactToPrintFn()}>
                    <Printer />
                    Print
                </Button>
            </div>

            <div className="mb-2">{children}</div>

            {/* Table */}
            {showAll && (
                <h2 className="text-2xl font-semibold text-gray-700 my-2">
                    Total Records:{" "}
                    <span className="text-blue-600">{cleanData.length}</span>
                </h2>
            )}

            <div className="w-full overflow-x-auto border rounded-lg">
                <div className="max-h-[800px] overflow-y-auto">
                    <table
                        ref={contentRef}
                        className="table-auto w-full min-w-max"
                    >
                        <thead className="sticky top-0 z-10 bg-white shadow-md">
                            <tr>
                                {allColumns.map(
                                    (col) =>
                                        visibleColumns.includes(col.key) && (
                                            <th
                                                key={col.key}
                                                className="bg-blue-600 text-white p-3 whitespace-nowrap text-wrap text-start text-sm font-semibold min-w-[60px] max-w-[100px]"
                                            >
                                                {col.label}
                                            </th>
                                        )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {cleanData.length > 0 ? (
                                cleanData.map((data) => (
                                    <tr
                                        key={data.id}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        {allColumns.map((col) =>
                                            visibleColumns.includes(col.key) ? (
                                                <td
                                                    key={col.key}
                                                    className="py-2 px-3 whitespace-wrap text-wrap break-words text-sm text-gray-700 min-w-[60px] max-w-[100px]"
                                                >
                                                    {columnRenderers[col.key]?.(
                                                        data
                                                    ) ?? ""}
                                                </td>
                                            ) : null
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={visibleColumns.length}
                                        className="text-center py-4 text-gray-500"
                                    >
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {visibleColumns.length === 0 ? (
                    <div className="p-2 text-sm text-red-600 font-medium w-full text-center rounded-lg border border-gray-200 mt-4">
                        All columns are hidden.
                    </div>
                ) : (
                    <div className="my-4">
                        {Array.isArray(passedData.links) &&
                            passedData.links.length > 0 && (
                                <Pagination
                                    links={passedData.links}
                                    queryParams={queryParams}
                                />
                            )}
                    </div>
                )}
            </div>
        </>
    );
};

export default DynamicTable;
