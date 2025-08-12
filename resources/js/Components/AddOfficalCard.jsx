import { Plus } from "lucide-react";

const FloatingAddButton = ({ onAdd }) => {
    return (
        <div className="fixed bottom-6 right-6 flex items-center z-50 group">
            {/* Tooltip */}
            <span
                className="absolute right-16 bg-gray-800 text-white text-sm px-3 py-1
                           rounded-md opacity-0 group-hover:opacity-100
                           transition-opacity duration-200 whitespace-nowrap shadow-md"
            >
                Add Barangay Official
            </span>

            {/* Floating Button */}
            <button
                onClick={onAdd}
                className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white
                           rounded-full flex items-center justify-center
                           shadow-xl hover:shadow-2xl
                           transition-transform duration-200 hover:scale-110"
            >
                <Plus className="w-6 h-6" />
            </button>
        </div>
    );
};

export default FloatingAddButton;
