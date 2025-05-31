import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import chatService from '../services/ChatService';
import { MCPTool } from '../types/index';
import { getSettingsStore } from '../stores/settings-store';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  metadata?: {
    model?: string;
    executionTime?: number;
    tokens?: number;
    tierUsed?: string;
    qualityScore?: number;
    toolsUsed?: string[];
  };
  media?: MediaItem[];
}

export interface MediaItem {
  id: string;
  type: string;
  name: string;
  data: string;
  previewUrl?: string;
}

interface ChatState {
  messages: ChatMessage[];
  inputValue: string;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  conversationId: string | null;
  showToolSelector: boolean;
  toolSelectorPos: { x: number; y: number } | null;
  toolSearchText: string;
  inputCursorPosition: number;
  uploadingFiles: File[];
  selectedFiles: string[];
  mediaItems: MediaItem[];
  currentModel: string;
  totalTokens: number;
  tokenLimit: number;
  mediaPreview: MediaItem | null;
}

type ChatAction = 
  | { type: 'SET_MESSAGES'; messages: ChatMessage[] }
  | { type: 'SET_INPUT_VALUE'; value: string }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_GENERATING'; isGenerating: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'SET_CONVERSATION_ID'; id: string | null }
  | { type: 'SET_TOOL_SELECTOR_VISIBLE'; visible: boolean }
  | { type: 'SET_TOOL_SELECTOR_POSITION'; position: { x: number; y: number } | null }
  | { type: 'SET_TOOL_SEARCH_TEXT'; text: string }
  | { type: 'SET_INPUT_CURSOR_POSITION'; position: number }
  | { type: 'ADD_UPLOADING_FILES'; files: File[] }
  | { type: 'REMOVE_UPLOADING_FILE'; index: number }
  | { type: 'CLEAR_UPLOADING_FILES' }
  | { type: 'ADD_SELECTED_FILE'; path: string }
  | { type: 'REMOVE_SELECTED_FILE'; path: string }
  | { type: 'CLEAR_SELECTED_FILES' }
  | { type: 'SET_CURRENT_MODEL'; model: string }
  | { type: 'SET_TOTAL_TOKENS'; count: number }
  | { type: 'SET_TOKEN_LIMIT'; limit: number }
  | { type: 'ADD_MEDIA_ITEM'; item: MediaItem }
  | { type: 'REMOVE_MEDIA_ITEM'; id: string }
  | { type: 'CLEAR_MEDIA_ITEMS' }
  | { type: 'SET_MEDIA_PREVIEW'; item: MediaItem | null };

interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (content: string) => Promise<void>;
  stopGeneration: () => void;
  handleToolSelect: (tool: MCPTool) => void;
  handleFileSelect: (path: string) => void;
  handleFileUpload: () => void;
  handleMediaUpload: () => void;
  removeFile: (index: number) => void;
  removeMediaItem: (id: string) => void;
  cancelMediaPreview: () => void;
  calculateTotalTokens: () => number;
  getModelContextLimit: (modelName: string) => number;
}

const initialState: ChatState = {
  messages: [],
  inputValue: '',
  isLoading: false,
  isGenerating: false,
  error: null,
  conversationId: null,
  showToolSelector: false,
  toolSelectorPos: null,
  toolSearchText: '',
  inputCursorPosition: 0,
  uploadingFiles: [],
  selectedFiles: [],
  mediaItems: [],
  currentModel: 'default',
  totalTokens: 0,
  tokenLimit: 4000,
  mediaPreview: null
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, messages: action.messages };
    case 'SET_INPUT_VALUE':
      return { ...state, inputValue: action.value };
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.isGenerating };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'SET_CONVERSATION_ID':
      return { ...state, conversationId: action.id };
    case 'SET_TOOL_SELECTOR_VISIBLE':
      return { ...state, showToolSelector: action.visible };
    case 'SET_TOOL_SELECTOR_POSITION':
      return { ...state, toolSelectorPos: action.position };
    case 'SET_TOOL_SEARCH_TEXT':
      return { ...state, toolSearchText: action.text };
    case 'SET_INPUT_CURSOR_POSITION':
      return { ...state, inputCursorPosition: action.position };
    case 'ADD_UPLOADING_FILES':
      return { ...state, uploadingFiles: [...state.uploadingFiles, ...action.files] };
    case 'REMOVE_UPLOADING_FILE':
      return { 
        ...state, 
        uploadingFiles: state.uploadingFiles.filter((_, i) => i !== action.index) 
      };
    case 'CLEAR_UPLOADING_FILES':
      return { ...state, uploadingFiles: [] };
    case 'ADD_SELECTED_FILE':
      if (state.selectedFiles.includes(action.path)) {
        return state;
      }
      return { ...state, selectedFiles: [...state.selectedFiles, action.path] };
    case 'REMOVE_SELECTED_FILE':
      return { 
        ...state, 
        selectedFiles: state.selectedFiles.filter(path => path !== action.path) 
      };
    case 'CLEAR_SELECTED_FILES':
      return { ...state, selectedFiles: [] };
    case 'SET_CURRENT_MODEL':
      return { ...state, currentModel: action.model };
    case 'SET_TOTAL_TOKENS':
      return { ...state, totalTokens: action.count };
    case 'SET_TOKEN_LIMIT':
      return { ...state, tokenLimit: action.limit };
    case 'ADD_MEDIA_ITEM':
      return { ...state, mediaItems: [...state.mediaItems, action.item] };
    case 'REMOVE_MEDIA_ITEM':
      return {
        ...state,
        mediaItems: state.mediaItems.filter(item => item.id !== action.id)
      };
    case 'CLEAR_MEDIA_ITEMS':
      return { ...state, mediaItems: [] };
    case 'SET_MEDIA_PREVIEW':
      return { ...state, mediaPreview: action.item };
    default:
      return state;
  }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize chat when component mounts
  useEffect(() => {
    initializeChat();
  }, []);

  // Subscribe to message changes
  useEffect(() => {
    const unsubscribe = chatService.onMessagesChanged((messages) => {
      dispatch({ type: 'SET_MESSAGES', messages });
      
      // Update token count
      const totalTokens = messages.reduce((total, message) => {
        return total + (message.metadata?.tokens || estimateTokenCount(message.content));
      }, 0);
      dispatch({ type: 'SET_TOTAL_TOKENS', count: totalTokens });
    });

    return unsubscribe;
  }, []);

  const initializeChat = async () => {
    try {
      // Get initial messages
      const messages = chatService.getCurrentMessages();
      dispatch({ type: 'SET_MESSAGES', messages });
      
      // Get conversation ID
      const conversation = chatService.getCurrentConversation();
      if (conversation) {
        dispatch({ type: 'SET_CONVERSATION_ID', id: conversation.id });
      }
      
      // Calculate initial token count
      const totalTokens = messages.reduce((total, message) => {
        return total + (message.metadata?.tokens || estimateTokenCount(message.content));
      }, 0);
      dispatch({ type: 'SET_TOTAL_TOKENS', count: totalTokens });
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        error: error instanceof Error ? error.message : 'Failed to initialize chat'
      });
    }
  };

  // Estimate token count for a text
  const estimateTokenCount = (text: string): number => {
    // Rough token estimation (4 characters per token average)
    return Math.ceil(text.length / 4);
  };

  // Calculate total tokens in the conversation
  const calculateTotalTokens = (): number => {
    return state.messages.reduce((total, message) => {
      // If we have an exact token count from the API, use that
      if (message.metadata?.tokens) {
        return total + message.metadata.tokens;
      }
      // Otherwise estimate based on content length
      return total + estimateTokenCount(message.content);
    }, 0);
  };

  // Get model context limits
  const getModelContextLimit = (modelName: string): number => {
    const modelLimits: Record<string, number> = {
      'meta-llama/llama-3.1-8b-instruct': 8192,
      'anthropic/claude-3-opus': 200000,
      'anthropic/claude-3-sonnet': 100000,
      'anthropic/claude-3-haiku': 48000,
      'openai/gpt-4o': 128000,
      'openai/gpt-4': 8192,
      'openai/gpt-3.5-turbo': 4096,
      'default': state.tokenLimit || 4000
    };
    
    // Find the matching model or partial match
    for (const key of Object.keys(modelLimits)) {
      if (modelName.includes(key)) {
        return modelLimits[key];
      }
    }
    
    return modelLimits.default;
  };

  const sendMessage = async (content?: string) => {
    const messageContent = content || state.inputValue.trim();
    const hasMedia = state.mediaPreview !== null;
    
    if (!messageContent && !hasMedia && state.uploadingFiles.length === 0 && state.selectedFiles.length === 0) return;

    // Check if adding this message would exceed the token limit
    const inputTokens = estimateTokenCount(messageContent);
    const totalTokens = calculateTotalTokens();
    const modelLimit = getModelContextLimit(state.currentModel);
    
    if (totalTokens + inputTokens > modelLimit) {
      dispatch({ 
        type: 'SET_ERROR', 
        error: `Message exceeds token limit. Please reduce your message by ${totalTokens + inputTokens - modelLimit} tokens.`
      });
      return;
    }

    dispatch({ type: 'SET_INPUT_VALUE', value: '' });
    dispatch({ type: 'SET_LOADING', isLoading: true });
    dispatch({ type: 'SET_ERROR', error: null });
    dispatch({ type: 'SET_GENERATING', isGenerating: true });

    try {
      let finalMessage = messageContent;
      const mediaItems: MediaItem[] = [];
      
      // Handle media preview if present
      if (state.mediaPreview) {
        mediaItems.push(state.mediaPreview);
        dispatch({ type: 'SET_MEDIA_PREVIEW', item: null });
      }
      
      // Handle file uploads if any
      if (state.uploadingFiles.length > 0) {
        const fileNames = state.uploadingFiles.map(file => file.name).join(', ');
        finalMessage = finalMessage 
          ? `${finalMessage}\n\nAttached files: ${fileNames}`
          : `Attached files: ${fileNames}`;
        
        dispatch({ type: 'CLEAR_UPLOADING_FILES' });
      }
      
      // Handle selected files from file browser
      if (state.selectedFiles.length > 0) {
        const fileReferences = state.selectedFiles.join(', ');
        finalMessage = finalMessage
          ? `${finalMessage}\n\nFile references: ${fileReferences}`
          : `File references: ${fileReferences}`;
        
        dispatch({ type: 'CLEAR_SELECTED_FILES' });
      }
      
      // Send the message with all file references and media
      await chatService.sendMessage(finalMessage, { media: mediaItems });
      
      dispatch({ type: 'SET_LOADING', isLoading: false });
      dispatch({ type: 'SET_GENERATING', isGenerating: false });

    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        error: error instanceof Error ? error.message : 'Failed to send message'
      });
      dispatch({ type: 'SET_LOADING', isLoading: false });
      dispatch({ type: 'SET_GENERATING', isGenerating: false });
    }
  };

  const stopGeneration = () => {
    // Simply update the UI state to indicate generation has stopped
    dispatch({ type: 'SET_GENERATING', isGenerating: false });
    dispatch({ type: 'SET_LOADING', isLoading: false });
    
    // Optionally add a message indicating generation was stopped
    const conversation = chatService.getCurrentConversation();
    if (conversation) {
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        lastMessage.content += '\n\n[Generation stopped by user]';
      }
    }
  };

  const handleToolSelect = (tool: MCPTool) => {
    const { inputValue, inputCursorPosition } = state;
    
    // Find the position of the @ symbol that triggered the selector
    const textBeforeCursor = inputValue.substring(0, inputCursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex >= 0) {
      // Replace the @searchText with the selected @tool
      const textBefore = inputValue.substring(0, lastAtIndex);
      const textAfter = inputValue.substring(inputCursorPosition);
      const newValue = `${textBefore}@${tool.name} ${textAfter}`;
      
      dispatch({ type: 'SET_INPUT_VALUE', value: newValue });
      
      // Focus back on input and set cursor after the inserted tool
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const newCursorPos = lastAtIndex + tool.name.length + 2; // +2 for @ and space
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
    
    dispatch({ type: 'SET_TOOL_SELECTOR_VISIBLE', visible: false });
  };

  const handleFileSelect = (path: string) => {
    dispatch({ type: 'ADD_SELECTED_FILE', path });
    dispatch({ type: 'SET_TOOL_SELECTOR_VISIBLE', visible: false });
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleMediaUpload = () => {
    if (mediaInputRef.current) {
      mediaInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      dispatch({ type: 'ADD_UPLOADING_FILES', files });
      
      // Reset the input to allow selecting the same file again
      e.target.value = '';
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]; // Take only the first file for media
      const reader = new FileReader();
      
      reader.onload = () => {
        const mediaItem: MediaItem = {
          id: `media_${Date.now()}`,
          type: file.type,
          name: file.name,
          data: reader.result as string,
        };
        
        dispatch({ type: 'SET_MEDIA_PREVIEW', item: mediaItem });
      };
      
      reader.readAsDataURL(file);
      
      // Reset the input to allow selecting the same file again
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    dispatch({ type: 'REMOVE_UPLOADING_FILE', index });
  };

  const removeMediaItem = (id: string) => {
    dispatch({ type: 'REMOVE_MEDIA_ITEM', id });
  };

  const cancelMediaPreview = () => {
    dispatch({ type: 'SET_MEDIA_PREVIEW', item: null });
  };

  return (
    <ChatContext.Provider value={{ 
      state, 
      dispatch, 
      sendMessage, 
      stopGeneration, 
      handleToolSelect,
      handleFileSelect,
      handleFileUpload,
      handleMediaUpload,
      removeFile,
      removeMediaItem,
      cancelMediaPreview,
      calculateTotalTokens,
      getModelContextLimit
    }}>
      {children}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        multiple 
      />
      <input
        type="file"
        ref={mediaInputRef}
        onChange={handleMediaChange}
        className="hidden"
        accept="image/*,video/*,audio/*"
      />
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
} 