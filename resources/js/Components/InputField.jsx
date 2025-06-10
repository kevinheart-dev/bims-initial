import React from 'react';

const InputField = ({ label, name, value, onChange, placeholder, type, disabled }) => (
    <div>
        <label className={`block text-sm font-semibold0 mb-3 mt-4 ${disabled ? 'text-gray-400' : ' text-gray-70'}`}
        >{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400
                ${disabled ? 'bg-gray-200 cursor-not-allowed' : ''}`}
            placeholder={placeholder}
        />
    </div>
);

export default InputField;
