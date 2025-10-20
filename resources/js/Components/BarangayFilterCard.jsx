import React from "react";
import SelectField from "./SelectField";

const BarangayFilterCard = ({
    selectedBarangay,
    handleBarangayChange,
    barangays,
}) => {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 md:p-8 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-gray-200">
            {/* Left: Title and Info */}
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Barangay Statistics
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                    Select a barangay to filter the population, gender, age
                    distribution, and household statistics. Leave it blank to
                    view data for all barangays.
                </p>
            </div>

            {/* Right: Barangay Dropdown */}
            <div className="w-full md:w-64">
                <SelectField
                    name="barangay"
                    value={selectedBarangay || ""}
                    onChange={handleBarangayChange}
                    items={[
                        {
                            value: "",
                            label: "Ilagan City (All Barangays)",
                        },
                        ...barangays.map((b) => ({
                            value: b.id,
                            label: b.name,
                        })),
                    ]}
                    placeholder="Select a barangay"
                />
            </div>
        </div>
    );
};

export default BarangayFilterCard;
