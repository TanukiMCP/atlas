import React from 'react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface MenuItem {
  label: string;
  action: () => void;
  type?: 'separator';
}

interface MenuDropdownProps {
  label: string;
  items: MenuItem[];
  className?: string;
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({
  label,
  items,
  className
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {items.map((item, index) => (
          item.type === 'separator' ? (
            <DropdownMenuSeparator key={`sep-${index}`} />
          ) : (
            <DropdownMenuItem key={item.label} onClick={item.action}>
              {item.label}
            </DropdownMenuItem>
          )
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 