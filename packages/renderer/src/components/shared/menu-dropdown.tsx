import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

interface MenuItem {
  label?: string;
  action?: () => void;
  shortcut?: string;
  type?: 'separator' | string;
  icon?: string;
  disabled?: boolean;
}

interface MenuDropdownProps {
  label: string;
  items: MenuItem[];
  className?: string;
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({ 
  label, 
  items, 
  className = ''
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className={`px-3 py-1 text-sm font-medium hover:bg-accent ${className}`}
        >
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {items.map((item, index) => {
          if (item.type === 'separator') {
            return <DropdownMenuSeparator key={index} />;
          }

          return (
            <DropdownMenuItem
              key={index}
              onClick={item.action}
              disabled={item.disabled}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2 flex-1">
                {item.icon && <span className="text-sm">{item.icon}</span>}
                <span>{item.label}</span>
              </div>
              {item.shortcut && (
                <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 