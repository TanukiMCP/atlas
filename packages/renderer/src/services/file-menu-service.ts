/**
 * File Menu Service - Comprehensive implementation for all File menu operations
 * Provides production-quality functionality for File menu items
 */

import { ChatSession, ChatExportOptions, Message } from '../types/chat-types';
import { useAppStore } from '../stores/app-store';

export interface ProjectData {
  id: string;
  name: string;
  path: string;
  description?: string;
  created: Date;
  updated: Date;
}

export class FileMenuService {
  private static instance: FileMenuService;

  public static getInstance(): FileMenuService {
    if (!FileMenuService.instance) {
      FileMenuService.instance = new FileMenuService();
    }
    return FileMenuService.instance;
  }

  /**
   * Create a new chat session
   * This completely resets the chat interface and creates a fresh session
   */
  async newChat(): Promise<ChatSession> {
    try {
      // Get current subject mode from store
      const currentMode = useAppStore.getState().currentSubjectMode || 'general';
      
      // Create new session via IPC
      const sessionData = {
        title: `New Chat - ${new Date().toLocaleString()}`,
        description: '',
        subjectMode: currentMode
      };

      if (typeof window !== 'undefined' && window.electronAPI) {
        const newSession = await window.electronAPI.invoke('chat:createSession', sessionData);
        
        // Update app store with new session
        useAppStore.getState().setCurrentChatSession(newSession.id);
        useAppStore.getState().addNotification({
          type: 'success',
          title: 'New Chat Created',
          message: 'A fresh chat session has been created successfully.'
        });

        return newSession;
      } else {
        // Fallback for development/testing
        const newSession: ChatSession = {
          id: `chat_${Date.now()}`,
          title: sessionData.title,
          description: sessionData.description,
          messages: [],
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: [],
            subjectMode: sessionData.subjectMode,
            isArchived: false,
            isFavorite: false
          },
          settings: {
            model: 'gpt-4',
            temperature: 0.7,
            maxTokens: 2048
          }
        };
        
        useAppStore.getState().setCurrentChatSession(newSession.id);
        useAppStore.getState().addNotification({
          type: 'info',
          title: 'New Chat (Development)',
          message: 'New chat created in development mode.'
        });

        return newSession;
      }
    } catch (error) {
      console.error('Failed to create new chat:', error);
      useAppStore.getState().addNotification({
        type: 'error',
        title: 'Failed to Create Chat',
        message: 'Unable to create a new chat session. Please try again.'
      });
      throw error;
    }
  }

  /**
   * Open an existing project
   * Shows file dialog to select project directory
   */
  async openProject(): Promise<ProjectData | null> {
    try {
      if (typeof window !== 'undefined' && window.electronAPI) {
        // Request project opening via IPC
        const projectPath = await window.electronAPI.invoke('dialog:showOpenDialog', {
          properties: ['openDirectory'],
          title: 'Select Project Directory'
        });

        if (projectPath && projectPath.filePaths && projectPath.filePaths.length > 0) {
          const selectedPath = projectPath.filePaths[0];
          
          // Create or load project data
          const projectData: ProjectData = {
            id: `project_${Date.now()}`,
            name: selectedPath.split(/[/\\]/).pop() || 'Unnamed Project',
            path: selectedPath,
            description: `Project opened from ${selectedPath}`,
            created: new Date(),
            updated: new Date()
          };

          // Update app store
          useAppStore.getState().setCurrentProject(projectData);
          useAppStore.getState().addNotification({
            type: 'success',
            title: 'Project Opened',
            message: `Successfully opened project: ${projectData.name}`
          });

          return projectData;
        }
      } else {
        // Development fallback
        useAppStore.getState().addNotification({
          type: 'info',
          title: 'Open Project (Development)',
          message: 'Project opening is not available in development mode.'
        });
      }

      return null;
    } catch (error) {
      console.error('Failed to open project:', error);
      useAppStore.getState().addNotification({
        type: 'error',
        title: 'Failed to Open Project',
        message: 'Unable to open the selected project. Please try again.'
      });
      throw error;
    }
  }

  /**
   * Save current chat session
   * Saves the current chat session to database
   */
  async saveChat(): Promise<boolean> {
    try {
      const currentSessionId = useAppStore.getState().currentChatSession;
      
      if (!currentSessionId) {
        useAppStore.getState().addNotification({
          type: 'warning',
          title: 'No Active Chat',
          message: 'There is no active chat session to save.'
        });
        return false;
      }

      if (typeof window !== 'undefined' && window.electronAPI) {
        // Save via IPC
        const success = await window.electronAPI.invoke('chat:updateSession', currentSessionId, {
          metadata: {
            updatedAt: new Date()
          },
          title: `Saved Chat - ${new Date().toLocaleString()}`
        });

        if (success) {
          useAppStore.getState().addNotification({
            type: 'success',
            title: 'Chat Saved',
            message: 'Your chat session has been saved successfully.'
          });
          return true;
        }
      } else {
        // Development fallback
        useAppStore.getState().addNotification({
          type: 'info',
          title: 'Chat Saved (Development)',
          message: 'Chat saved in development mode.'
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to save chat:', error);
      useAppStore.getState().addNotification({
        type: 'error',
        title: 'Failed to Save Chat',
        message: 'Unable to save the chat session. Please try again.'
      });
      return false;
    }
  }

  /**
   * Export current chat session to file
   * Allows user to save chat as JSON or Markdown
   */
  async exportChat(): Promise<boolean> {
    try {
      const currentSessionId = useAppStore.getState().currentChatSession;
      
      if (!currentSessionId) {
        useAppStore.getState().addNotification({
          type: 'warning',
          title: 'No Active Chat',
          message: 'There is no active chat session to export.'
        });
        return false;
      }

      if (typeof window !== 'undefined' && window.electronAPI) {
        // Get chat session data
        const session = await window.electronAPI.invoke('chat:getSession', currentSessionId);
        const messages = await window.electronAPI.invoke('chat:getMessages', currentSessionId);
        
        // Show save dialog
        const savePath = await window.electronAPI.invoke('dialog:showSaveDialog', {
          title: 'Export Chat Session',
          defaultPath: `chat-export-${session.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`,
          filters: [
            { name: 'JSON Files', extensions: ['json'] },
            { name: 'Markdown Files', extensions: ['md'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        });

        if (savePath && savePath.filePath) {
          const exportData = {
            session,
            messages,
            exportedAt: new Date().toISOString(),
            version: '1.0'
          };

          let content: string;
          const isMarkdown = savePath.filePath.endsWith('.md');
          
          if (isMarkdown) {
            // Export as Markdown
            content = this.formatChatAsMarkdown(session, messages);
          } else {
            // Export as JSON
            content = JSON.stringify(exportData, null, 2);
          }

          await window.electronAPI.invoke('fs:writeFile', savePath.filePath, content);
          
          useAppStore.getState().addNotification({
            type: 'success',
            title: 'Chat Exported',
            message: `Chat session exported successfully to ${savePath.filePath}`
          });
          
          return true;
        }
      } else {
        // Development fallback
        useAppStore.getState().addNotification({
          type: 'info',
          title: 'Export Chat (Development)',
          message: 'Chat export is not available in development mode.'
        });
      }

      return false;
    } catch (error) {
      console.error('Failed to export chat:', error);
      useAppStore.getState().addNotification({
        type: 'error',
        title: 'Failed to Export Chat',
        message: 'Unable to export the chat session. Please try again.'
      });
      return false;
    }
  }

  /**
   * Import chat session from file
   * Allows user to load previously exported chat sessions
   */
  async importChat(): Promise<ChatSession | null> {
    try {
      if (typeof window !== 'undefined' && window.electronAPI) {
        // Show open dialog
        const openPath = await window.electronAPI.invoke('dialog:showOpenDialog', {
          title: 'Import Chat Session',
          properties: ['openFile'],
          filters: [
            { name: 'JSON Files', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        });

        if (openPath && openPath.filePaths && openPath.filePaths.length > 0) {
          const filePath = openPath.filePaths[0];
          const fileContent = await window.electronAPI.invoke('fs:readFile', filePath);
          
          if (fileContent) {
            const importData = JSON.parse(fileContent);
            
            // Validate import data structure
            if (!importData.session || !importData.messages) {
              throw new Error('Invalid chat export file format');
            }

            // Create new session with imported data
            const newSessionData = {
              ...importData.session,
              id: `imported_${Date.now()}`,
              title: `${importData.session.title} (Imported)`,
              metadata: {
                ...importData.session.metadata,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            };

            const newSession = await window.electronAPI.invoke('chat:createSession', newSessionData);
            
            // Import messages
            for (const message of importData.messages) {
              await window.electronAPI.invoke('chat:addMessage', {
                ...message,
                id: `msg_${Date.now()}_${Math.random()}`,
                sessionId: newSession.id
              });
            }

            useAppStore.getState().setCurrentChatSession(newSession.id);
            useAppStore.getState().addNotification({
              type: 'success',
              title: 'Chat Imported',
              message: `Successfully imported chat: ${newSession.title}`
            });

            return newSession;
          }
        }
      } else {
        // Development fallback
        useAppStore.getState().addNotification({
          type: 'info',
          title: 'Import Chat (Development)',
          message: 'Chat import is not available in development mode.'
        });
      }

      return null;
    } catch (error) {
      console.error('Failed to import chat:', error);
      useAppStore.getState().addNotification({
        type: 'error',
        title: 'Failed to Import Chat',
        message: 'Unable to import the chat session. Please check the file format.'
      });
      return null;
    }
  }

  /**
   * Navigate to Settings view
   * Opens the application settings interface
   */
  openSettings(): void {
    try {
      // Navigate to settings view
      useAppStore.getState().setCurrentView('settings');
      
      useAppStore.getState().addNotification({
        type: 'info',
        title: 'Settings Opened',
        message: 'Application settings are now displayed.'
      });
    } catch (error) {
      console.error('Failed to open settings:', error);
      useAppStore.getState().addNotification({
        type: 'error',
        title: 'Failed to Open Settings',
        message: 'Unable to open settings. Please try again.'
      });
    }
  }

  /**
   * Exit the application
   * Performs cleanup and closes the application safely
   */
  async exitApplication(): Promise<void> {
    try {
      // Check for unsaved changes
      const hasUnsavedChanges = await this.checkUnsavedChanges();
      
      if (hasUnsavedChanges) {
        const shouldExit = await this.showConfirmationDialog(
          'Exit Application',
          'You have unsaved changes. Are you sure you want to exit?',
          ['Save and Exit', 'Exit Without Saving', 'Cancel']
        );
        
        if (shouldExit === 'Cancel') {
          return;
        }
        
        if (shouldExit === 'Save and Exit') {
          const saved = await this.saveChat();
          if (!saved) {
            // If save failed, ask user what to do
            const forceExit = await this.showConfirmationDialog(
              'Save Failed',
              'Failed to save your changes. Exit anyway?'
            );
            if (!forceExit) return;
          }
        }
      }

      // Perform cleanup
      await this.performCleanup();

      // Close application
      if (typeof window !== 'undefined' && window.electronAPI) {
        await window.electronAPI.invoke('app:quit');
      } else {
        // Fallback for development
        console.log('Application exit requested (development mode)');
        useAppStore.getState().addNotification({
          type: 'info',
          title: 'Exit (Development)',
          message: 'Application exit requested in development mode.'
        });
      }
    } catch (error) {
      console.error('Failed to exit application:', error);
      useAppStore.getState().addNotification({
        type: 'error',
        title: 'Exit Failed',
        message: 'Unable to exit the application safely. Please try again.'
      });
    }
  }

  /**
   * Check if there are unsaved changes
   */
  private async checkUnsavedChanges(): Promise<boolean> {
    try {
      const currentSessionId = useAppStore.getState().currentChatSession;
      if (!currentSessionId) return false;

      if (typeof window !== 'undefined' && window.electronAPI) {
        return await window.electronAPI.invoke('chat:hasUnsavedChanges', currentSessionId);
      }
      
      // Development fallback - assume no unsaved changes
      return false;
    } catch (error) {
      console.error('Error checking unsaved changes:', error);
      return false;
    }
  }

  /**
   * Show confirmation dialog
   */
  private async showConfirmationDialog(
    title: string, 
    message: string, 
    buttons: string[] = ['Yes', 'No']
  ): Promise<string | boolean> {
    try {
      if (typeof window !== 'undefined' && window.electronAPI) {
        const result = await window.electronAPI.invoke('dialog:showMessageBox', {
          type: 'question',
          title,
          message,
          buttons,
          defaultId: 0,
          cancelId: 1
        });
        
        return buttons.length > 2 ? buttons[result.response] : result.response === 0;
      }
      
      // Fallback for development - use browser confirm
      if (buttons.length === 2) {
        return confirm(`${title}\n\n${message}`);
      } else {
        // For multiple buttons, just use confirm as fallback
        return confirm(`${title}\n\n${message}`) ? buttons[0] : buttons[buttons.length - 1];
      }
    } catch (error) {
      console.error('Error showing confirmation dialog:', error);
      return false;
    }
  }

  /**
   * Perform application cleanup before exit
   */
  private async performCleanup(): Promise<void> {
    try {
      // Save app state
      const appState = useAppStore.getState();
      
      // Clear any temporary data
      appState.setLoading('*', false);
      appState.setError('*', null);
      
      // Close any open connections
      if (typeof window !== 'undefined' && window.electronAPI) {
        await window.electronAPI.invoke('cleanup:all');
      }
      
      console.log('Application cleanup completed');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  /**
   * Format chat session as Markdown for export
   */
  private formatChatAsMarkdown(session: ChatSession, messages: Message[]): string {
    let markdown = `# ${session.title}\n\n`;
    markdown += `**Created:** ${session.metadata.createdAt.toLocaleString()}\n`;
    markdown += `**Subject Mode:** ${session.metadata.subjectMode}\n`;
    if (session.description) {
      markdown += `**Description:** ${session.description}\n`;
    }
    markdown += `\n---\n\n`;

    messages.forEach((message, index) => {
      const timestamp = message.timestamp.toLocaleString();
      const roleIcon = message.role === 'user' ? '👤' : message.role === 'assistant' ? '🤖' : '⚙️';
      
      markdown += `## ${roleIcon} ${message.role.charAt(0).toUpperCase() + message.role.slice(1)}\n`;
      markdown += `*${timestamp}*\n\n`;
      markdown += `${message.content}\n\n`;
      
      if (index < messages.length - 1) {
        markdown += `---\n\n`;
      }
    });

    return markdown;
  }
}

// Export singleton instance
export const fileMenuService = FileMenuService.getInstance(); 