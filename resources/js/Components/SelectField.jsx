import React from "react";

const SelectField = ({
    label,
    name,
    value,
    onChange,
    required = false,
    disabled = false,
    items,
    placeholder = "Select an option",
}) => {
    return (
        <div>
            {label && (
                <label
                    className={`block text-sm font-semibold mb-3 mt-4 ${
                        disabled ? "text-gray-400" : "text-gray-700"
                    }`}
                >
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </label>
            )}

            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none text-gray-500
                        ${
                            disabled
                                ? "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed"
                                : "border-gray-400 focus:ring-2 focus:ring-indigo-500 text-gray-800"
                        }
                    `}
            >
                <option value="" className="text-gray-400">
                    {placeholder}
                </option>
                {/* {items.map((item, index) => (
                    <option key={`${item.value}-${index}`} value={item.value}>
                        {item.label}
                    </option>
                ))} */}
                {items.map((item, index) => (
                    <option
                        key={`${item.value}-${index}`}
                        value={item.value}
                        title={item.subtitle ? item.subtitle : undefined} // optional title
                    >
                        {item.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectField;
