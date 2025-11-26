import { FileOutput, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const ExportButton = ({
    url,
    queryParams = {},
    type = "xlsx",
    label,
    icon: customIcon,
    totalRecords = 0, // NEW prop to determine if button should be disabled
}) => {
    const isPDF = type.toLowerCase() === "pdf";
    const isDisabled = totalRecords > 500;

    const handleClick = () => {
        if (isDisabled) return; // prevent click if disabled
        const queryString =
            Object.keys(queryParams).length > 0
                ? new URLSearchParams(queryParams).toString()
                : "";
        const fullUrl = queryString ? `${url}?${queryString}` : url;
        window.open(fullUrl, "_blank");
    };

    // outline style variant
    const colorClasses = isDisabled
        ? "border border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
        : isPDF
        ? "border border-red-500 text-red-600 bg-transparent hover:bg-red-600 hover:text-white active:bg-red-700"
        : "border border-green-500 text-green-600 bg-transparent hover:bg-green-600 hover:text-white active:bg-green-700";

    const buttonLabel = label || (isPDF ? "Export as PDF" : "Export as XLSX");
    const icon = customIcon || (isPDF ? <FileText /> : <FileOutput />);

    return (
        <div className="relative group z-50">
            <Button
                className={`${colorClasses} gap-2 transition-colors duration-200`}
                variant="outline"
                onClick={handleClick}
                disabled={isDisabled} // disable the button
            >
                {icon}
            </Button>
            {!isDisabled && (
                <div
                    className={`absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 ${
                        isPDF ? "bg-red-700" : "bg-green-700"
                    }`}
                >
                    {buttonLabel}
                </div>
            )}
        </div>
    );
};

export default ExportButton;
