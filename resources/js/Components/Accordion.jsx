import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function Accordion({ title, children, defaultOpen = false }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-gray-200 rounded-lg shadow-sm mb-2 overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
                <span className="font-medium text-gray-800">{title}</span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
            </button>

            {/* Content */}
            {isOpen && (
                <div className="p-4 bg-white border-t border-gray-200 animate-fadeIn">
                    {children}
                </div>
            )}
        </div>
    );
}
