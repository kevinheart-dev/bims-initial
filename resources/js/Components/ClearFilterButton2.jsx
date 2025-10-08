import { FunnelX } from "lucide-react";
import { Button } from "./ui/button";

export default function ClearFilterButton2({ setQueryParams, setQuery }) {
    const handleClear = () => {
        // Reset queryParams and query input
        setQueryParams({});
        if (setQuery) setQuery("");
    };

    return (
        <div className="relative group z-30">
            <Button
                variant="outline"
                onClick={handleClear}
                className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
                <FunnelX className="w-4 h-4" />
            </Button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-red-600 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                Reset Filters
            </div>
        </div>

    );
}
