import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import { router } from "@inertiajs/react";

export default function ClearFilterButton({ routeName, routeParams = {} }) {
    const handleClear = () => {
        const safeParams = routeParams && typeof routeParams === "object" ? routeParams : {};

        router.visit(route(routeName, safeParams), {
            method: "get",
            data: {}, // Clear all query params
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
