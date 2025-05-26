import React from 'react';
import { PanelLayout } from '../../hooks/use-ui-store';
interface PanelManagerProps {
    layout: PanelLayout;
    onLayoutChange: (layout: Partial<PanelLayout>) => void;
    panels: {
        fileExplorer: React.ReactNode;
        centerPanel: React.ReactNode;
        rightPanel: React.ReactNode;
        bottomPanel: React.ReactNode;
    };
}
export declare const PanelManager: React.FC<PanelManagerProps>;
export {};
//# sourceMappingURL=panel-manager.d.ts.map