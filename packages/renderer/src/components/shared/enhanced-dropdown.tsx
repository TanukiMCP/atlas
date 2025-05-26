import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

interface MenuItem {
  label?: string;
  action?: () => void;
  shortcut?: string;
  type?: 'separator';
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface EnhancedDropdownProps {
  label: string;
  items: MenuItem[];
  triggerMode?: 'click' | 'hover';
  direction?: 'down' | 'up' | 'left' | 'right';
  className?: string;
}

export const EnhancedDropdown: React.FC<EnhancedDropdownProps> = ({ 
  label, 
  items, 
  triggerMode = 'click',
  direction = 'down',
  className = ''
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className={`h-auto px-3 py-2 font-medium hover:bg-accent hover:text-accent-foreground ${className}`}
        >
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        side={direction === 'up' ? 'top' : 'bottom'}
        className="min-w-48"
      >
        {items.map((item, index) => {
          if (item.type === 'separator') {
            return <DropdownMenuSeparator key={index} />;
          }
          
          return (
            <DropdownMenuItem
              key={index}
              onClick={item.action}
              disabled={item.disabled}
              className="flex items-center gap-2 cursor-pointer"
            >
              {item.icon && <span className="w-4 h-4">{item.icon}</span>}
              <span className="flex-1">{item.label}</span>
              {item.shortcut && (
                <span className="text-xs text-muted-foreground ml-auto">
                  {item.shortcut}
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};