import React from 'react';
import { AppView } from './ide-layout';
interface MenuBarProps {
    onNewChat: () => void;
    onOpenProject: () => void;
    onSaveChat: () => void;
    onSubjectModeChange: (mode: string) => void;
    currentMode: string;
    onOpenMCPManager: () => void;
    onOpenLLMPromptManagement: () => void;
    onNavigate: (view: AppView) => void;
}
export declare const MenuBar: React.FC<MenuBarProps>;
export {};
//# sourceMappingURL=menu-bar.d.ts.map