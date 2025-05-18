import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";

export default function ClearFilterButton() {
    const handleClear = () => {
        router.visit(route("resident.index"), {
            method: "get",
            data: {},
            replace: true,
            preserveScroll: true,
        });
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
