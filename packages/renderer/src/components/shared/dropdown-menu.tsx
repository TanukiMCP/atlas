import React, { useState } from 'react';

interface MenuItem {
  label: string;
  action?: () => void;
  shortcut?: string;
  type?: 'separator';
}

interface DropdownMenuProps {
  label: string;
  items: MenuItem[];
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
      >
        {label}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {items.map((item, index) => (
            item.type === 'separator' ? (
              <div key={index} className="border-t border-gray-200 dark:border-gray-700 my-1" />
            ) : (
              <button
                key={index}
                onClick={() => {
                  item.action?.();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center"
              >
                <span>{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs text-gray-500">{item.shortcut}</span>
                )}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
};