export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant' | 'system';
    timestamp: Date;
    metadata?: {
        toolCalls?: ToolCall[];
        attachments?: Attachment[];
        tags?: string[];
    };
}
export interface ToolCall {
    id: string;
    name: string;
    arguments: Record<string, any>;
    result?: any;
    status: 'pending' | 'success' | 'error';
}
export interface Attachment {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
}
export interface ChatSession {
    id: string;
    title: string;
    description?: string;
    messages: Message[];
    metadata: {
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        subjectMode: string;
        isArchived: boolean;
        isFavorite: boolean;
        workflowId?: string;
    };
    settings: {
        model: string;
        temperature: number;
        maxTokens: number;
        systemPrompt?: string;
    };
}
export interface ChatSearchFilters {
    query?: string;
    tags?: string[];
    dateRange?: {
        start: Date;
        end: Date;
    };
    subjectMode?: string;
    hasAttachments?: boolean;
    isArchived?: boolean;
    isFavorite?: boolean;
}
export interface ChatExportOptions {
    format: 'json' | 'markdown' | 'txt' | 'html';
    includeMetadata: boolean;
    includeAttachments: boolean;
}
//# sourceMappingURL=chat-types.d.ts.map