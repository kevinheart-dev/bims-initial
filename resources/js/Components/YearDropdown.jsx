import React from "react";

const YearDropdown = ({
    label = "Year",
    name,
    value,
    onChange,
    startYear = 1900,
    endYear = new Date().getFullYear(),
    required = false,
    disabled = false,
}) => {
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i); // Descending order

    return (
        <div>
            <label className={`block text-sm font-semibold  mb-3 mt-4 ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
                {label}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none text-gray-400
                        ${disabled
                        ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
                        : 'border-gray-400 focus:ring-2 focus:ring-indigo-500  text-gray-800'}
                    `}
            >
                <option value="">Select year</option>
                {years.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default YearDropdown;
