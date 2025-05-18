import React from 'react';

const InputField = ({ label, name, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 mt-4">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder={placeholder}
        />
    </div>
);

export default InputField;
