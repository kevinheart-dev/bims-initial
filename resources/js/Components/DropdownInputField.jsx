import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const DropdownInputField = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    items = [],
    disabled = false,
    readOnly = false
}) => {
    const [inputValue, setInputValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    const getLabel = (item) => typeof item === 'string' ? item : item.label;
    const getValue = (item) => typeof item === 'string' ? item : item.value;

    useEffect(() => {
        if (value) {
            const matchedItem = items.find(item =>
                typeof item === 'object' ? item.value === value : item === value
            );
            setInputValue(matchedItem ? getLabel(matchedItem) : value);
        } else {
            setInputValue('');
        }
    }, [value, items]);

    const handleInputChange = (e) => {
        if (disabled || readOnly) return;
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange?.({ target: { name, value: newValue } });
        setShowDropdown(true);
    };

    const handleItemSelect = (item) => {
        const selectedValue = getValue(item);
        const selectedLabel = getLabel(item);
        setInputValue(selectedLabel);
        onChange?.({ target: { name, value: selectedValue } });
        setShowDropdown(false);
    };

    const handleFocus = () => {
        if (disabled || readOnly) return;
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
        setShowDropdown(true);
    };

    const handleClickOutside = (e) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(e.target) &&
            !inputRef.current.contains(e.target)
        ) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        if (showDropdown && !(disabled || readOnly)) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDropdown, disabled, readOnly]);

    const filteredItems = items.filter((item) =>
        getLabel(item).toLowerCase().includes(inputValue.toLowerCase())
    );

    const baseClass = `w-full border rounded-md px-3 py-2 focus:outline-none`;
    const stateClass = disabled || readOnly
        ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
        : 'border-gray-400 focus:ring-2 focus:ring-indigo-500 text-gray-800';

    return (
        <div className="relative">
            <label className={`block text-sm font-semibold mb-3 mt-4 ${disabled || readOnly ? 'text-gray-400' : 'text-gray-700'}`}>
                {label}
            </label>

            {readOnly ? (
                <div
                    className={`${baseClass} ${stateClass} min-h-[38px] flex items-center`}
                >
                    {inputValue || '-'}
                </div>
            ) : (
                <input
                    ref={inputRef}
                    type="text"
                    name={name}
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    className={`${baseClass} ${stateClass}`}
                    autoComplete="off"
                    disabled={disabled}
                />
            )}

            {!disabled && !readOnly && showDropdown && filteredItems.length > 0 &&
                ReactDOM.createPortal(
                    <ul
                        ref={dropdownRef}
                        style={{
                            position: 'absolute',
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                            width: dropdownPosition.width,
                            zIndex: 9999,
                        }}
                        className="max-h-48 overflow-auto rounded-md border border-gray-300 bg-white shadow-md"
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
                    </ul>,
                    document.body
                )
            }
        </div>
    );
};

export default DropdownInputField;
