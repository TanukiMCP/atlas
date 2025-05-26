/**
 * Edit Menu Service - Comprehensive implementation for all Edit menu operations
 * Provides production-quality functionality for Edit menu items including:
 * - Undo/Redo with proper state management
 * - Clipboard operations (Cut, Copy, Paste)
 * - Find and Replace functionality
 * - Text selection and manipulation
 * - Context-aware editing based on active component
 */
export interface EditState {
    canUndo: boolean;
    canRedo: boolean;
    canCut: boolean;
    canCopy: boolean;
    canPaste: boolean;
    hasSelection: boolean;
    selectedText: string;
    activeElement: HTMLElement | null;
}
export interface SearchState {
    isSearchOpen: boolean;
    searchTerm: string;
    replaceTerm: string;
    matchCase: boolean;
    useRegex: boolean;
    searchResults: SearchResult[];
    currentResultIndex: number;
}
export interface SearchResult {
    element: HTMLElement;
    text: string;
    startIndex: number;
    endIndex: number;
    context: string;
}
export interface UndoRedoAction {
    id: string;
    type: 'text' | 'selection' | 'format' | 'custom';
    timestamp: number;
    description: string;
    data: {
        element: HTMLElement;
        beforeState: any;
        afterState: any;
        selectionBefore?: {
            start: number;
            end: number;
        };
        selectionAfter?: {
            start: number;
            end: number;
        };
    };
}
export declare class EditMenuService {
    private static instance;
    private undoStack;
    private redoStack;
    private maxUndoStackSize;
    private searchState;
    private clipboardData;
    static getInstance(): EditMenuService;
    constructor();
    /**
     * Get current edit state for UI updates
     */
    getEditState(): EditState;
    /**
     * Undo last action
     */
    undo(): Promise<boolean>;
    /**
     * Redo last undone action
     */
    redo(): Promise<boolean>;
    /**
     * Cut selected text to clipboard
     */
    cut(): Promise<boolean>;
    /**
     * Copy selected text to clipboard
     */
    copy(): Promise<boolean>;
    /**
     * Paste text from clipboard
     */
    paste(): Promise<boolean>;
    /**
     * Select all text in current context
     */
    selectAll(): Promise<boolean>;
    /**
     * Open find dialog
     */
    find(): Promise<boolean>;
    /**
     * Open find and replace dialog
     */
    replace(): Promise<boolean>;
    /**
     * Search for text in the current context
     */
    search(term: string, options?: {
        matchCase?: boolean;
        useRegex?: boolean;
    }): Promise<SearchResult[]>;
    /**
     * Navigate to next search result
     */
    findNext(): boolean;
    /**
     * Navigate to previous search result
     */
    findPrevious(): boolean;
    /**
     * Replace current search result
     */
    replaceOne(replacementText: string): Promise<boolean>;
    /**
     * Replace all search results
     */
    replaceAll(replacementText: string): Promise<number>;
    private setupKeyboardShortcuts;
    private setupClipboardListeners;
    private isEditableElement;
    private captureElementState;
    private getElementTextContent;
    private insertText;
    private deleteSelection;
    private findMatches;
    private getContext;
    private highlightSearchResult;
    private replaceTextInElement;
    private recordAction;
    private applyUndoRedoAction;
    getSearchState(): SearchState;
    getUndoStackSize(): number;
    getRedoStackSize(): number;
    cleanup(): void;
}
export declare const editMenuService: EditMenuService;
//# sourceMappingURL=edit-menu-service.d.ts.map