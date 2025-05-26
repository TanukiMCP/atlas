export interface SubjectMode {
    id: string;
    name: string;
    icon: string;
    color: string;
    description?: string;
    settings?: {
        preferredModel?: string;
        systemPrompt?: string;
        tools?: string[];
        shortcuts?: Record<string, string>;
    };
}
export interface ModeSpecificUI {
    toolbarItems?: ToolbarItem[];
    sidebarPanels?: SidebarPanel[];
    contextMenuItems?: ContextMenuItem[];
    statusBarItems?: StatusBarItem[];
}
export interface ToolbarItem {
    id: string;
    label: string;
    icon: string;
    action: () => void;
    tooltip?: string;
    isActive?: boolean;
    isDisabled?: boolean;
}
export interface SidebarPanel {
    id: string;
    title: string;
    component: React.ComponentType;
    icon: string;
    isCollapsible?: boolean;
    defaultCollapsed?: boolean;
}
export interface ContextMenuItem {
    id: string;
    label: string;
    action: () => void;
    icon?: string;
    shortcut?: string;
    separator?: boolean;
}
export interface StatusBarItem {
    id: string;
    text: string;
    tooltip?: string;
    action?: () => void;
    priority: number;
}
//# sourceMappingURL=subject-types.d.ts.map