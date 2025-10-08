import React from "react";

const InputField = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    disabled = false,
    readOnly = false,
    isTextarea = false,
    rows = 3,
    step = 1,
    options = [],
    required = false,
}) => {
    const getDisplayValue = () => {
        if (options.length > 0) {
            const match = options.find((opt) =>
                typeof opt === "object" ? opt.value === value : opt === value
            );
            return match
                ? typeof match === "object"
                    ? match.label
                    : match
                : value;
        }
        return value;
    };

    const baseClass = `w-full border rounded-md px-3 py-2 focus:outline-none`;
    const stateClass =
        disabled || readOnly
            ? "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed"
            : "border-gray-400 focus:ring-2 focus:ring-indigo-500 text-gray-800";

    return (
        <div>
            {label && (
                <label
                    className={`block text-sm font-semibold mb-3 mt-4 ${
                        disabled || readOnly ? "text-gray-400" : "text-gray-700"
                    }`}
                >
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </label>
            )}

            {readOnly ? (
                <div
                    className={`${baseClass} ${stateClass} min-h-[38px] flex items-center`}
                >
                    {getDisplayValue()}
                </div>
            ) : isTextarea ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    rows={rows}
                    required={required}
                    className={`${baseClass} resize-none ${stateClass}`}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    required={required}
                    step={step}
                    className={`${baseClass} ${stateClass}`}
                />
            )}
        </div>
    );
};

export default InputField;
