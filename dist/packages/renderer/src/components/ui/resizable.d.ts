import { PanelResizeHandle } from "react-resizable-panels";
export declare const ResizablePanelGroup: import("react").ForwardRefExoticComponent<Omit<import("react").HTMLAttributes<keyof HTMLElementTagNameMap>, "id"> & {
    autoSaveId?: string | null;
    className?: string;
    direction: import("react-resizable-panels/dist/declarations/src/types").Direction;
    id?: string | null;
    keyboardResizeBy?: number | null;
    onLayout?: import("react-resizable-panels").PanelGroupOnLayout | null;
    storage?: import("react-resizable-panels").PanelGroupStorage;
    style?: import("react").CSSProperties;
    tagName?: keyof HTMLElementTagNameMap;
    dir?: "auto" | "ltr" | "rtl" | undefined;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<import("react-resizable-panels").ImperativePanelGroupHandle>>;
export declare const ResizablePanel: import("react").ForwardRefExoticComponent<Omit<import("react").HTMLAttributes<HTMLDivElement | HTMLElement | HTMLButtonElement | HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement | HTMLSelectElement | HTMLOptionElement | HTMLOptGroupElement | HTMLInputElement | HTMLLabelElement | HTMLTextAreaElement | HTMLDetailsElement | HTMLAnchorElement | HTMLPreElement | HTMLBRElement | HTMLObjectElement | HTMLMapElement | HTMLDataElement | HTMLStyleElement | HTMLLinkElement | HTMLSourceElement | HTMLTitleElement | HTMLProgressElement | HTMLTableElement | HTMLTimeElement | HTMLBodyElement | HTMLHtmlElement | HTMLFormElement | HTMLSlotElement | HTMLDialogElement | HTMLImageElement | HTMLAreaElement | HTMLAudioElement | HTMLBaseElement | HTMLQuoteElement | HTMLCanvasElement | HTMLTableColElement | HTMLDataListElement | HTMLModElement | HTMLDListElement | HTMLEmbedElement | HTMLFieldSetElement | HTMLHeadElement | HTMLHRElement | HTMLIFrameElement | HTMLLegendElement | HTMLLIElement | HTMLMetaElement | HTMLMeterElement | HTMLOListElement | HTMLOutputElement | HTMLScriptElement | HTMLTableSectionElement | HTMLTableCellElement | HTMLTemplateElement | HTMLTableRowElement | HTMLTrackElement | HTMLUListElement | HTMLVideoElement | HTMLTableCaptionElement | HTMLMenuElement | HTMLPictureElement>, "id" | "onResize"> & {
    className?: string;
    collapsedSize?: number | undefined;
    collapsible?: boolean | undefined;
    defaultSize?: number | undefined;
    id?: string;
    maxSize?: number | undefined;
    minSize?: number | undefined;
    onCollapse?: import("react-resizable-panels").PanelOnCollapse;
    onExpand?: import("react-resizable-panels").PanelOnExpand;
    onResize?: import("react-resizable-panels").PanelOnResize;
    order?: number;
    style?: object;
    tagName?: keyof HTMLElementTagNameMap | undefined;
} & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<import("react-resizable-panels").ImperativePanelHandle>>;
export declare const ResizableHandle: typeof PanelResizeHandle;
//# sourceMappingURL=resizable.d.ts.map