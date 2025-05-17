import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

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
            className="bg-gray-500 text-sm text-gray-900 hover:text-red-600"
            onClick={handleClear}
        >
            <XCircle className="w-4 h-4 mr-1" />
            Clear Filters
        </Button>
    );
}
