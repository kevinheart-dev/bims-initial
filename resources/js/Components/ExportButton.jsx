import React from "react";
import { Button } from "@/components/ui/button"; // adjust import if needed
import { Table } from "lucide-react"; // your icon

const ExportButton = ({
    url,
    queryParams = {},
    label = "Export as XLSX",
    icon = <Table />,
}) => {
    const handleClick = () => {
        const queryString =
            Object.keys(queryParams).length > 0
                ? new URLSearchParams(queryParams).toString()
                : "";
        const fullUrl = queryString ? `${url}?${queryString}` : url;
        window.open(fullUrl, "_blank");
    };

    return (
        <div className="relative group z-50">
            <Button
                className="border active:bg-green-900 border-green-300 text-green-700 hover:bg-green-600 hover:text-white gap-2 bg-transparent"
                variant="outline"
                onClick={handleClick}
            >
                {icon}
            </Button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-green-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                {label}
            </div>
        </div>
    );
};

export default ExportButton;
