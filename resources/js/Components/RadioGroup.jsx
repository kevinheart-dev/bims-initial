import React from 'react';

function RadioGroup({ label, name, options = [], selectedValue, onChange, disabled, required }) {
    return (
        <div className="relative mt-4">
            {label && (
                <label
                    className={`block text-sm font-semibold mb-3
                    ${disabled ? ' text-gray-400' : ' text-gray-700'} `}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="flex space-x-0.5">
                {options.map((option) => {
                    const isSelected = String(selectedValue) === String(option.value); // Normalize both
                    return (
                        <label
                            key={option.value}
                            className={`inline-flex items-center rounded-md px-3 py-2 text-sm transition-colors duration-200
                                ${isSelected ? 'bg-blue-600 text-white' : 'bg-white'}
                                ${disabled
                                    ? 'opacity-50 text-gray-400 cursor-not-allowed pointer-events-none'
                                    : 'text-gray-700 cursor-pointer'}
                            `}
                        >
                            <input
                                type="radio"
                                name={name}
                                value={option.value}
                                checked={isSelected}
                                onChange={onChange}
                                disabled={disabled}
                                required={required}
                                className="sr-only"
                            />
                            <span
                                className={`w-4 h-4 mr-2 rounded-full flex items-center justify-center
                                    ${isSelected ? 'bg-blue-200 border-2 border-blue-600' : 'border border-gray-400'}
                                    ${disabled ? ' text-gray-400' : ' text-gray-700'}
                                `}
                            >
                                {isSelected && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
                            </span>
                            <span className="select-none">{option.label}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}

export default RadioGroup;
