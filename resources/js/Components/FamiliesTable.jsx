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
import { useRef, useState } from "react";
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
import { usePage } from "@inertiajs/react";
import { all } from "axios";

const FamiliesTable = ({ passedData, allColumns, columnRenderers }) => {
    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.map((col) => col.key)
    );

    const handleEdit = (id) => {
        // Your edit logic here
    };

    const handleDelete = (id) => {
        // Your delete logic here
    };

    return (
        <>
            {/* Column Toggle + Print */}
            <div className="mb-4 flex items-center gap-4">
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
            </div>

            {/* Table */}
            <div className="max-h-[600px] overflow-auto">
                <Table className="min-w-full">
                    <TableHeader className="sticky top-0 z-10 bg-white shadow-md">
                        <TableRow>
                            {allColumns.map(
                                (col) =>
                                    visibleColumns.includes(col.key) && (
                                        <TableHead
                                            key={col.key}
                                            className="bg-blue-600 text-white p-4 whitespace-nowrap"
                                        >
                                            {col.label}
                                        </TableHead>
                                    )
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {passedData.length > 0 ? (
                            passedData.map((data) => (
                                <TableRow key={data.id}>
                                    {allColumns.map((col) =>
                                        visibleColumns.includes(col.key) ? (
                                            <TableCell key={col.key}>
                                                {columnRenderers[col.key]?.(
                                                    data
                                                ) ?? ""}
                                            </TableCell>
                                        ) : null
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={visibleColumns.length}
                                    className="text-center py-4 text-gray-500"
                                >
                                    No records found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="flex justify-end items-center p-4 rounded shadow-sm">
                    <h2 className="text-2xl font-semibold text-gray-700">
                        Total Records:{" "}
                        <span className="text-blue-600">
                            {passedData.length}
                        </span>
                    </h2>
                </div>
            </div>
        </>
    );
};

export default FamiliesTable;
