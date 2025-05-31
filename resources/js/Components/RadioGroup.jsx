import React from 'react';

function RadioGroup({ label, name, options = [], selectedValue, onChange }) {
    return (
        <div className="relative mt-4">
            {label && <label className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>}
            <div className="flex space-x-1">
                {options.map((option) => (
                    <label
                        key={option.value}
                        tabIndex={0}
                        className={`inline-flex items-center cursor-pointer rounded-md px-2 py-2 text-gray-700`}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={selectedValue === option.value}
                            onChange={onChange}
                            className="form-radio text-indigo-600"
                        />
                        <span className="ml-2 select-none">{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}

export default RadioGroup;
