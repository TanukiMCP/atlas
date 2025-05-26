import * as React from "react";
import { PanelGroup, PanelResizeHandle } from "react-resizable-panels";
declare const ResizablePanelGroup: ({ className, ...props }: React.ComponentProps<typeof PanelGroup>) => import("react/jsx-runtime").JSX.Element;
declare const ResizablePanel: React.ForwardRefExoticComponent<Omit<React.HTMLAttributes<HTMLDivElement | HTMLElement | HTMLButtonElement | HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement | HTMLSelectElement | HTMLOptionElement | HTMLOptGroupElement | HTMLInputElement | HTMLLabelElement | HTMLTextAreaElement | HTMLObjectElement | HTMLMapElement | HTMLTitleElement | HTMLDataElement | HTMLSourceElement | HTMLProgressElement | HTMLLinkElement | HTMLTableElement | HTMLTimeElement | HTMLBodyElement | HTMLStyleElement | HTMLHtmlElement | HTMLSlotElement | HTMLDialogElement | HTMLFormElement | HTMLImageElement | HTMLAnchorElement | HTMLLIElement | HTMLOListElement | HTMLUListElement | HTMLAreaElement | HTMLAudioElement | HTMLBaseElement | HTMLQuoteElement | HTMLBRElement | HTMLCanvasElement | HTMLTableColElement | HTMLDataListElement | HTMLModElement | HTMLDetailsElement | HTMLDListElement | HTMLEmbedElement | HTMLFieldSetElement | HTMLHeadElement | HTMLHRElement | HTMLIFrameElement | HTMLLegendElement | HTMLMetaElement | HTMLMeterElement | HTMLOutputElement | HTMLPreElement | HTMLScriptElement | HTMLTemplateElement | HTMLTableSectionElement | HTMLTableCellElement | HTMLTableRowElement | HTMLTrackElement | HTMLVideoElement | HTMLTableCaptionElement | HTMLMenuElement | HTMLPictureElement>, "id" | "onResize"> & {
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
} & React.RefAttributes<import("react-resizable-panels").ImperativePanelHandle>>;
declare const ResizableHandle: ({ withHandle, className, ...props }: React.ComponentProps<typeof PanelResizeHandle> & {
    withHandle?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
//# sourceMappingURL=resizable.d.ts.map