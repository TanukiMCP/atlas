/**
 * File Menu Service - Comprehensive implementation for all File menu operations
 * Provides production-quality functionality for File menu items
 */
import { ChatSession } from '../types/chat-types';
export interface ProjectData {
    id: string;
    name: string;
    path: string;
    description?: string;
    created: Date;
    updated: Date;
}
export declare class FileMenuService {
    private static instance;
    static getInstance(): FileMenuService;
    /**
     * Create a new chat session
     * This completely resets the chat interface and creates a fresh session
     */
    newChat(): Promise<ChatSession>;
    /**
     * Open an existing project
     * Shows file dialog to select project directory
     */
    openProject(): Promise<ProjectData | null>;
    /**
     * Save current chat session
     * Saves the current chat session to database
     */
    saveChat(): Promise<boolean>;
    /**
     * Export current chat session to file
     * Allows user to save chat as JSON or Markdown
     */
    exportChat(): Promise<boolean>;
    /**
     * Import chat session from file
     * Allows user to load previously exported chat sessions
     */
    importChat(): Promise<ChatSession | null>;
    /**
     * Navigate to Settings view
     * Opens the application settings interface
     */
    openSettings(): void;
    /**
     * Exit the application
     * Performs cleanup and closes the application safely
     */
    exitApplication(): Promise<void>;
    /**
     * Check if there are unsaved changes
     */
    private checkUnsavedChanges;
    /**
     * Show confirmation dialog
     */
    private showConfirmationDialog;
    /**
     * Perform application cleanup before exit
     */
    private performCleanup;
    /**
     * Format chat session as Markdown for export
     */
    private formatChatAsMarkdown;
}
export declare const fileMenuService: FileMenuService;
//# sourceMappingURL=file-menu-service.d.ts.map