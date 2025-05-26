export interface PanelLayout {
    leftPanel: {
        width: number;
        isVisible: boolean;
        activeTab: string;
    };
    rightPanel: {
        width: number;
        isVisible: boolean;
        activeTab: string;
    };
    bottomPanel: {
        height: number;
        isVisible: boolean;
        activeTab: string;
    };
}
export declare const useUIStore: () => {
    layout: PanelLayout;
    theme: "dark" | "light";
    isFullscreen: boolean;
    updateLayout: (newLayout: Partial<PanelLayout>) => void;
    togglePanel: (panel: keyof PanelLayout) => void;
    setTheme: import("react").Dispatch<import("react").SetStateAction<"dark" | "light">>;
    setIsFullscreen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
};
//# sourceMappingURL=use-ui-store.d.ts.map