import { ListFilter } from "lucide-react";
import { Button } from "./ui/button";

export default function ClearFilterButton2({ setQueryParams, setQuery }) {
    const handleClear = () => {
        // Reset queryParams and query input
        setQueryParams({});
        if (setQuery) setQuery("");
    };

    return (
        <Button
            variant="outline"
            className="border border-red-500 text-sm text-red-500 hover:bg-red-500 hover:text-white"
            onClick={handleClear}
        >
            <ListFilter className="w-4 h-4 mr-1" />
            Clear Filters
        </Button>
    );
}
