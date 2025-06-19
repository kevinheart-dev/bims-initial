import React from 'react';

const InputField = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = 'text',
    disabled,
    isTextarea = false,
    rows = 3,
}) => (
    <div>
        <label
            className={`block text-sm font-semibold mb-3 mt-4 ${disabled ? 'text-gray-400' : 'text-gray-700'}`}
        >
            {label}
        </label>

        {isTextarea ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                rows={rows}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none resize-none
                    ${disabled
                        ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
                        : 'border-gray-400 focus:ring-2 focus:ring-indigo-500 text-gray-800'}
                `}
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none
                    ${disabled
                        ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
                        : 'border-gray-400 focus:ring-2 focus:ring-indigo-500 text-gray-800'}
                `}
            />
        )}
    </div>
);

export default InputField;
