import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Columns3, Printer, Rows3, Rows4, Funnel } from "lucide-react";

const DynamicTableControls = ({
    allColumns,
    visibleColumns,
    setVisibleColumns,
    onPrint,
    toggleShowFilters,
    showFilters,
}) => {
    return (
        <div className="flex flex-wrap items-center gap-2 mb-4">
            {/* Columns Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="relative group z-5">
                        <Button
                            className="border active:bg-blue-900 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white flex items-center gap-2 bg-transparent"
                            variant="outline"
                        >
                            <Columns3 className="w-4 h-4" />
                        </Button>
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                            Columns
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                        checked={visibleColumns.length === allColumns.length}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                setVisibleColumns(allColumns.map((col) => col.key));
                            } else {
                                setVisibleColumns([]);
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
                            } else {
                                setVisibleColumns(allColumns.map((col) => col.key));
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
                            onCheckedChange={(checked) => {
                                setVisibleColumns((prev) => {
                                    if (checked) {
                                        return [...prev, col.key];
                                    } else {
                                        return prev.filter((k) => k !== col.key);
                                    }
                                });
                            }}
                        >
                            {col.label}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Pagination toggle
            {is_paginated && (
                <Button
                    onClick={toggleShowAll}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    {showAll ? <Rows3 /> : <Rows4 />}
                    {showAll ? "Show Paginated" : "Show Full List"}
                </Button>
            )} */}

            {/* Print */}
            <div className="relative group z-5">
                <Button
                    className="border active:bg-blue-900 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white flex items-center gap-2 bg-transparent"
                    variant="outline"
                    onClick={onPrint}
                >
                    <Printer className="w-4 h-4" />
                </Button>
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    Print
                </div>
            </div>

            {/* Filter Button */}
            <Button
                variant="outline"
                onClick={toggleShowFilters}
                className="flex items-center gap-2"
            >
                <Funnel className="w-4 h-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
        </div>
    );
};

export default DynamicTableControls;
