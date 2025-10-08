import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ListFilter } from "lucide-react";

const voterStates = [
    {
        value: "All",
        label: "All",
        icon: <ListFilter className="w-4 h-4 text-gray-600" />,
    },
    {
        value: "1",
        label: "Registered",
        icon: <CheckCircle className="w-4 h-4 text-green-600" />,
    },
    {
        value: "0",
        label: "Unregistered",
        icon: <XCircle className="w-4 h-4 text-red-600" />,
    },
];

export default function VoterStatusToggle({ value = "all", onChange }) {
    const initialIndex = Math.max(
        voterStates.findIndex((state) => state.value === value),
        0
    );
    const [index, setIndex] = useState(initialIndex);

    useEffect(() => {
        // sync index when external value changes
        const newIndex = voterStates.findIndex(
            (state) => state.value === value
        );
        if (newIndex !== -1 && newIndex !== index) {
            setIndex(newIndex);
        }
    }, [value]);

    const handleClick = () => {
        const nextIndex = (index + 1) % voterStates.length;
        setIndex(nextIndex);
        onChange?.(voterStates[nextIndex].value);
    };

    const current = voterStates[index];

    return (
        <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleClick}
        >
            {current.icon}
            {current.label}
        </Button>
    );
}
