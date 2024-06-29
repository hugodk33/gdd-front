import React, { useState } from 'react';

export function CheckBox({
    label,
    id,
    value
}: {
    label?: string;
    id?: string;
    value?: (checkedLabel: string) => void;
}) {
    const [checked, setChecked] = useState(false);

    const handleChange = () => {
        setChecked(!checked);
        if (value && typeof value === 'function' && checked) {
            value('off-' + label || '');
        } else if(value && typeof value === 'function' && !checked) {
            value(label || '');
        }
    };

    return (        
        <div className="flex items-center mb-4">
            <input
                id={id}
                type="checkbox"
                value=""
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                checked={checked}
                onChange={handleChange}
            />
            <label
                htmlFor={id}
                className="ml-2 text-sm font-medium  text-bold"
                style={{ color: '#1d4ed8' }}
            >
                {label}
            </label>
        </div>
    )
}
