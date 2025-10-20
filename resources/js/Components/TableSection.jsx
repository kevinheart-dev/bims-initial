import React from "react";
import { Card } from "@/components/ui/card";

/**
 * TableSection
 * Reusable section with a styled header, dynamic color scheme, and a data table.
 *
 * Props:
 * - icon: React element (Lucide icon)
 * - color: Tailwind color name (e.g. "red", "blue", "green")
 * - title: Section title
 * - description: Short paragraph under the title
 * - tableProps: {
 *     component: Component, // e.g., DynamicTable
 *     ...props
 *   }
 */
const TableSection = ({ icon, color, title, description, tableProps }) => {
    return (
        <div className="w-full mb-8 px-2 sm:px-4 lg:px-4 relative overflow-x-hidden">
            {/* Header */}


            <Card className="w-full mx-auto border border-gray-200 rounded-xl shadow-md bg-white">
                <div
                    className={`flex items-center gap-4 p-4 bg-${color}-50 rounded-2xl shadow-sm m-4 border border-${color}-100`}
                >
                    <div
                        className={`p-3 bg-${color}-100 rounded-full flex items-center justify-center`}
                    >
                        {React.cloneElement(icon, {
                            className: `w-6 h-6 text-${color}-600`,
                        })}
                    </div>

                    <div className="flex flex-col">
                        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
                            {title}
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto p-3 md:p-4">
                    <tableProps.component
                        {...tableProps}
                        tableHeight={tableProps.tableHeight || "450px"}
                    />
                </div>
            </Card>

            <div className="w-full mx-auto mt-10 h-[2px] bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 rounded-full shadow-sm"></div>
        </div>
    );
};


export default TableSection;
