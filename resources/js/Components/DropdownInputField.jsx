import React, { useState, useRef } from 'react';

const DropdownInputField = ({ label, name, value, onChange, placeholder, items = [] }) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Helper to get the label text to display
    const getLabel = (item) => (typeof item === 'string' ? item : item.label);
    // Helper to get the actual value to store
    const getValue = (item) => (typeof item === 'string' ? item : item.value);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange({ target: { name, value: newValue } });
        setShowDropdown(true);
    };

    const handleItemSelect = (item) => {
        const selectedValue = getValue(item);
        setInputValue(getLabel(item));
        onChange({ target: { name, value: selectedValue } });
        setShowDropdown(false);
    };

    const handleFocus = () => setShowDropdown(true);

    const handleBlur = (e) => {
        if (!dropdownRef.current?.contains(e.relatedTarget)) {
            setTimeout(() => setShowDropdown(false), 100);
        }
    };

    const filteredItems = items.filter((item) =>
        getLabel(item).toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <div className="relative" onBlur={handleBlur}>
            <label className="block text-sm font-semibold text-gray-700 mb-3 mt-4">{label}</label>
            <input
                type="text"
                name={name}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                placeholder={placeholder}
                className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                autoComplete="off"
            />

            {showDropdown && filteredItems.length > 0 && (
                <ul
                    ref={dropdownRef}
                    className="absolute z-10 w-full mt-1 max-h-48 overflow-auto rounded-md border border-gray-300 bg-white shadow-md"
                >
                    {filteredItems.map((item, index) => (
                        <li
                            key={index}
                            tabIndex={0}
                            onClick={() => handleItemSelect(item)}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        >
                            {getLabel(item)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownInputField;
