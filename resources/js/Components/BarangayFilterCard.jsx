import React from "react";
import SelectField from "./SelectField";

const BarangayFilterCard = ({
    selectedBarangay,
    handleBarangayChange,
    barangays,
}) => {
    return (
        <div className="bg-white shadow-sm rounded-lg p-4 md:p-5 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-200 mx-4 w-auto">

            {/* Left: Title and Info */}
            <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    Barangay Statistics
                </h2>
                <p className="text-gray-600 text-xs md:text-sm leading-snug">
                    Select a barangay to filter population and household
                    statistics. Leave blank to view data for all barangays.
                </p>
            </div>

            {/* Right: Barangay Dropdown */}
            <div className="w-full md:w-56">
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
                    placeholder="Select barangay"
                />
            </div>
        </div>
    );
};

export default BarangayFilterCard;
