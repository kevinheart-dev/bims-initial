import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableCaption,
} from "@/components/ui/table";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Pagination from "./Pagination";
import DynamicTableControls from "./FilterButtons/DynamicTableControls";

const DynamicTable = ({
    passedData,
    allColumns,
    columnRenderers,
    children,
    is_paginated = false,
    toggleShowAll = null,
    showAll = null,
    queryParams = null,
    searchFieldName = null,
    householdId = null,
    showTotal = false,
    visibleColumns = [],
    setVisibleColumns = () => { },
}) => {
    const contentRef = useRef();
    const reactToPrintFn = useReactToPrint({ content: () => contentRef.current });

    const cleanData = Array.isArray(passedData?.data)
        ? passedData.data
        : passedData || [];

    const [sortBy, setSortBy] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");

    const effectiveVisibleColumns =
        visibleColumns !== undefined && visibleColumns !== null
            ? visibleColumns
            : allColumns.map((col) => col.key);

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
            <div className="flex justify-between items-center">
                {showTotal && (
                    <h2 className="text-xl font-bold text-gray-800 my-2 p-2 border bg-gray-50 rounded-lg flex items-center gap-2">
                        <span>Total Records:</span>
                        <span className="text-white bg-blue-600 px-3 py-1 rounded-full shadow-md">
                            {cleanData.length}
                        </span>
                    </h2>
                )}
            </div>

            <div className="mb-2">{children}</div>

            {/* Table */}
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
                                        effectiveVisibleColumns.includes(col.key) && (
                                            <th
                                                key={col.key}
                                                className="bg-blue-500 text-white p-3 whitespace-nowrap text-wrap text-start text-sm font-semibold min-w-[60px] max-w-[100px]"
                                            >
                                                {col.label}
                                            </th>
                                        )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {cleanData.length > 0 ? (
                                sortedData.map((data, rowIndex) => (
                                    <tr
                                        key={data.id || rowIndex}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        {allColumns.map((col) =>
                                            effectiveVisibleColumns.includes(col.key) ? (
                                                <td
                                                    key={`${data.id || rowIndex}-${col.key}`}
                                                    className="py-2 px-3 whitespace-wrap text-wrap break-words text-sm text-gray-700 min-w-[60px] max-w-[100px]"
                                                >
                                                    {columnRenderers[col.key]?.(data) ?? ""}
                                                </td>
                                            ) : null
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={effectiveVisibleColumns.length}
                                        className="text-center py-4 text-gray-500"
                                    >
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {effectiveVisibleColumns.length === 0 ? (
                    <div className="p-2 text-sm text-red-600 font-medium w-full text-center rounded-lg border border-gray-200 mt-4">
                        All columns are hidden.
                    </div>
                ) : (
                    <div className="my-2 mr-4 flex justify-end">
                        {Array.isArray(passedData?.links) &&
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
