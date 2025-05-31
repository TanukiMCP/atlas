import React, { useState, useEffect, useRef } from 'react';
import { mcpService } from '../../services/mcp-service';
import { fileService, FileInfo, FileContent } from '../../services/file-service';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { X, Search, Zap, File, Folder, AlertCircle, ChevronUp, Home, ExternalLink, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { MCPTool } from '../../types/index';
import path from 'path-browserify';

interface ToolSelectorProps {
  isOpen: boolean;
  position: { x: number; y: number };
  operationalMode: 'agent' | 'chat';
  onToolSelect: (tool: MCPTool) => void;
  onFileSelect: (path: string) => void;
  onClose: () => void;
  currentModel?: string;
}

// List of common special characters that might need escaping in file paths
const SPECIAL_CHARS_REGEX = /[&\s\[\](){}^=+!,;'"`~<>]/g;

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  isOpen,
  position,
  operationalMode,
  onToolSelect,
  onFileSelect,
  onClose,
  currentModel = 'default'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [availableTools, setAvailableTools] = useState<MCPTool[]>([]);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [currentDir, setCurrentDir] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'tools' | 'files'>('tools');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [tokenInfo, setTokenInfo] = useState<{current: number; limit: number} | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [recentDirectories, setRecentDirectories] = useState<string[]>([]);
  const [showExternalPathInput, setShowExternalPathInput] = useState(false);
  const [externalPath, setExternalPath] = useState('');
  const [pathError, setPathError] = useState<string | null>(null);
  
  const externalPathInputRef = useRef<HTMLInputElement>(null);

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
      'default': 4000
    };
    
    // Find the matching model or partial match
    for (const key of Object.keys(modelLimits)) {
      if (modelName.includes(key)) {
        return modelLimits[key];
      }
    }
    
    return modelLimits.default;
  };

  // Estimate token count for a file
  const estimateTokenCount = (content: string): number => {
    // Rough token estimation (4 characters per token average)
    return Math.ceil(content.length / 4);
  };

  // Load tools from MCP service
  useEffect(() => {
    if (isOpen && mcpService.isReady()) {
      const tools = mcpService.getAvailableTools(operationalMode);
      setAvailableTools(tools);
    }
  }, [isOpen, operationalMode]);

  // Load files from current directory
  useEffect(() => {
    if (isOpen && activeTab === 'files') {
      loadFiles(currentDir);
      
      // Load recent directories from localStorage
      try {
        const saved = localStorage.getItem('recentDirectories');
        if (saved) {
          setRecentDirectories(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Failed to load recent directories:', error);
      }
    }
  }, [isOpen, currentDir, activeTab]);

  // Focus external path input when shown
  useEffect(() => {
    if (showExternalPathInput && externalPathInputRef.current) {
      externalPathInputRef.current.focus();
    }
  }, [showExternalPathInput]);

  const loadFiles = async (dirPath: string) => {
    setIsLoading(true);
    try {
      const fileList = await fileService.listDirectory(dirPath);
      setFiles(fileList);
      
      // Add to recent directories if not already there
      if (dirPath && !recentDirectories.includes(dirPath)) {
        const updatedRecents = [dirPath, ...recentDirectories.slice(0, 4)];
        setRecentDirectories(updatedRecents);
        localStorage.setItem('recentDirectories', JSON.stringify(updatedRecents));
      }
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileClick = async (file: FileInfo) => {
    if (file.type === 'directory') {
      setCurrentDir(file.path);
    } else {
      // Check if adding this file would exceed token limits
      try {
        const fileContent: FileContent = await fileService.readFile(file.path);
        const fileTokens = estimateTokenCount(fileContent.content);
        const modelLimit = getModelContextLimit(currentModel);
        const currentTokens = selectedFiles.reduce((total, path) => {
          // This is simplified - in a real implementation, we'd store the actual token counts
          return total + (path === file.path ? 0 : 500); // Assume 500 tokens per previously selected file
        }, 0);
        
        const newTotalTokens = currentTokens + fileTokens;
        
        // Update token info
        setTokenInfo({
          current: newTotalTokens,
          limit: modelLimit
        });
        
        if (newTotalTokens > modelLimit) {
          // Don't add the file, but show warning in UI
          return;
        }
        
        // Add to selected files if not already there
        if (!selectedFiles.includes(file.path)) {
          setSelectedFiles([...selectedFiles, file.path]);
        }
        
        // Properly escape special characters in the file path
        const escapedPath = escapeFilePath(file.path);
        
        // Notify parent
        onFileSelect(escapedPath);
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }
  };

  const handleFileNavigateUp = () => {
    if (!currentDir) return;
    
    const parts = currentDir.split(/[/\\]/);
    parts.pop(); // Remove last part
    const parentDir = parts.join('/');
    setCurrentDir(parentDir);
  };
  
  const handleGoHome = () => {
    setCurrentDir('');
  };
  
  const handleExternalPathSubmit = async () => {
    setPathError(null);
    
    if (!externalPath) {
      setPathError('Please enter a path');
      return;
    }
    
    try {
      // Check if path exists
      const exists = await fileService.fileExists(externalPath);
      if (!exists) {
        setPathError('Path does not exist');
        return;
      }
      
      // Get file info to determine if it's a directory or file
      const fileInfo = await fileService.getFileInfo(externalPath);
      if (!fileInfo) {
        setPathError('Unable to access path');
        return;
      }
      
      if (fileInfo.type === 'directory') {
        // Navigate to directory
        setCurrentDir(externalPath);
        setShowExternalPathInput(false);
        setExternalPath('');
      } else {
        // Select file
        const escapedPath = escapeFilePath(externalPath);
        onFileSelect(escapedPath);
        setShowExternalPathInput(false);
        setExternalPath('');
      }
    } catch (error) {
      console.error('Error accessing external path:', error);
      setPathError('Error accessing path');
    }
  };
  
  // Escape special characters in file paths
  const escapeFilePath = (filePath: string): string => {
    // If the path contains special characters, wrap it in quotes
    if (SPECIAL_CHARS_REGEX.test(filePath)) {
      return `"${filePath}"`;
    }
    return filePath;
  };
  
  // Handle selection of recent directory
  const handleSelectRecentDirectory = (dirPath: string) => {
    setCurrentDir(dirPath);
  };

  const filteredTools = searchQuery
    ? availableTools.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableTools;

  const filteredFiles = searchQuery
    ? files.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : files;

  const getCategoryColor = (category: string) => {
    const colors = {
      'file': 'bg-blue-100 text-blue-800',
      'web': 'bg-green-100 text-green-800', 
      'data': 'bg-purple-100 text-purple-800',
      'ai': 'bg-orange-100 text-orange-800',
      'system': 'bg-gray-100 text-gray-800',
      'thinking': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed z-50"
      style={{ left: position.x, top: position.y }}
    >
      <Card className="w-96 max-h-[500px] shadow-lg border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              {activeTab === 'tools' ? 'Tool Selection' : 'File Browser'} ({operationalMode} mode)
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'tools' | 'files')} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={activeTab === 'tools' ? "Search tools..." : "Search files..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <TabsContent value="tools" className="m-0">
            <ScrollArea className="h-64">
              <div className="p-3 space-y-2">
                {filteredTools.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    {searchQuery ? `No tools found matching "${searchQuery}"` : 'No tools available'}
                  </div>
                ) : (
                  filteredTools.map((tool, index) => (
                    <div
                      key={tool.name}
                      onClick={() => onToolSelect(tool)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                        index === selectedIndex 
                          ? 'bg-accent border-accent-foreground/20' 
                          : 'hover:bg-muted border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{tool.icon || '🔧'}</span>
                          <div>
                            <div className="font-medium">{tool.name}</div>
                            {tool.description && (
                              <div className="text-xs text-muted-foreground">
                                {tool.description}
                              </div>
                            )}
                          </div>
                        </div>
                        {tool.category && (
                          <Badge className={getCategoryColor(tool.category)}>
                            {tool.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="files" className="m-0">
            {tokenInfo && (
              <div className={`px-3 py-2 text-xs border-b ${
                tokenInfo.current > tokenInfo.limit ? 'bg-red-50 text-red-800 border-red-200' : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}>
                {tokenInfo.current > tokenInfo.limit ? (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Token limit exceeded: {tokenInfo.current}/{tokenInfo.limit} tokens</span>
                  </div>
                ) : (
                  <span>Context usage: {tokenInfo.current}/{tokenInfo.limit} tokens</span>
                )}
              </div>
            )}
            
            {/* External path input */}
            {showExternalPathInput ? (
              <div className="px-3 py-2 border-b">
                <div className="flex items-center gap-2">
                  <Input
                    ref={externalPathInputRef}
                    value={externalPath}
                    onChange={(e) => setExternalPath(e.target.value)}
                    placeholder="Enter absolute path (C:/path/to/file)"
                    className="text-sm h-8"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleExternalPathSubmit();
                      } else if (e.key === 'Escape') {
                        setShowExternalPathInput(false);
                        setExternalPath('');
                      }
                    }}
                  />
                  <Button 
                    size="sm" 
                    className="h-8"
                    onClick={handleExternalPathSubmit}
                  >
                    Go
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      setShowExternalPathInput(false);
                      setExternalPath('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {pathError && (
                  <div className="text-red-500 text-xs mt-1">{pathError}</div>
                )}
              </div>
            ) : (
              /* Directory navigation */
              <div className="flex items-center px-3 py-2 border-b">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleFileNavigateUp}
                  disabled={!currentDir}
                  className="h-8 w-8 p-0"
                  title="Go up"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleGoHome}
                  className="h-8 w-8 p-0 ml-1"
                  title="Go to workspace root"
                >
                  <Home className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowExternalPathInput(true)}
                  className="h-8 w-8 p-0 ml-1"
                  title="Browse external path"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <div className="text-sm truncate ml-2 flex-1">
                  {currentDir || 'Workspace Root'}
                </div>
              </div>
            )}
            
            {/* Recent directories */}
            {recentDirectories.length > 0 && !showExternalPathInput && (
              <div className="px-3 py-1 border-b">
                <div className="text-xs text-muted-foreground mb-1">Recent Directories</div>
                <div className="flex flex-wrap gap-1">
                  {recentDirectories.map((dir) => (
                    <Badge 
                      key={dir} 
                      variant="outline"
                      className="cursor-pointer hover:bg-accent flex items-center gap-1"
                      onClick={() => handleSelectRecentDirectory(dir)}
                    >
                      <Star className="h-3 w-3" />
                      <span className="truncate max-w-[150px]">{dir.split('/').pop() || dir}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <ScrollArea className="h-56">
              <div className="p-3 space-y-1">
                {isLoading ? (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    Loading files...
                  </div>
                ) : filteredFiles.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    {searchQuery ? `No files found matching "${searchQuery}"` : 'No files available'}
                  </div>
                ) : (
                  filteredFiles.map((file, index) => (
                    <div
                      key={file.path}
                      onClick={() => handleFileClick(file)}
                      className={`p-2 rounded-md cursor-pointer transition-colors ${
                        index === selectedFileIndex 
                          ? 'bg-accent' 
                          : 'hover:bg-muted'
                      } ${selectedFiles.includes(file.path) ? 'border-l-4 border-primary' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        {file.type === 'directory' ? (
                          <Folder className="h-4 w-4 text-blue-500" />
                        ) : (
                          <File className="h-4 w-4 text-gray-500" />
                        )}
                        <div className="truncate">{file.name}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};