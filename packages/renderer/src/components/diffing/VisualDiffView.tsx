import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { File, Check, X, Play, ChevronRight, ChevronDown } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';
import { useToolSettings } from '../../hooks/use-tool-settings';

interface FileDiff {
  operation: 'create' | 'update' | 'delete';
  filePath: string;
  previousContent?: string;
  newContent?: string;
  changes?: {
    lineNumber: number;
    type: 'add' | 'remove' | 'unchanged';
    content: string;
  }[];
}

interface VisualDiffViewProps {
  diff: FileDiff;
  onApprove: () => void;
  onReject: () => void;
  onViewOriginal?: () => void;
}

const VisualDiffView: React.FC<VisualDiffViewProps> = ({
  diff,
  onApprove,
  onReject,
  onViewOriginal
}) => {
  const [view, setView] = useState<'unified' | 'split'>('unified');
  const [showAll, setShowAll] = useState(true);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [animatedLines, setAnimatedLines] = useState<number[]>([]);
  const { settings } = useToolSettings();
  
  // Animation timing based on settings
  const getAnimationDelay = (index: number) => {
    const baseDelay = settings.diffingAnimationSpeed === 'fast' 
      ? 50 
      : settings.diffingAnimationSpeed === 'slow' 
        ? 200 
        : 100;
    return index * baseDelay;
  };
  
  // Start animations when component mounts
  useEffect(() => {
    if (!diff.changes || !settings.visualDiffing) return;
    
    const changeLines = diff.changes
      .filter(change => change.type !== 'unchanged')
      .map((_, index) => index);
    
    let timer: NodeJS.Timeout;
    
    // Animate lines sequentially
    changeLines.forEach((lineIndex, i) => {
      timer = setTimeout(() => {
        setAnimatedLines(prev => [...prev, lineIndex]);
      }, getAnimationDelay(i));
    });
    
    return () => clearTimeout(timer);
  }, [diff.changes, settings.visualDiffing, settings.diffingAnimationSpeed]);
  
  const toggleSection = (sectionIndex: number) => {
    setExpandedSections(prev => 
      prev.includes(sectionIndex)
        ? prev.filter(i => i !== sectionIndex)
        : [...prev, sectionIndex]
    );
  };
  
  // Group changes into sections (unchanged, changed)
  const getSections = () => {
    if (!diff.changes) return [];
    
    const sections: {
      type: 'changed' | 'unchanged';
      lines: typeof diff.changes;
      startLine: number;
      endLine: number;
    }[] = [];
    
    let currentSection: typeof sections[0] | null = null;
    
    diff.changes.forEach((change, index) => {
      if (!currentSection) {
        currentSection = {
          type: change.type === 'unchanged' ? 'unchanged' : 'changed',
          lines: [change],
          startLine: index,
          endLine: index
        };
      } else if (
        (currentSection.type === 'unchanged' && change.type === 'unchanged') ||
        (currentSection.type === 'changed' && change.type !== 'unchanged')
      ) {
        currentSection.lines.push(change);
        currentSection.endLine = index;
      } else {
        sections.push(currentSection);
        currentSection = {
          type: change.type === 'unchanged' ? 'unchanged' : 'changed',
          lines: [change],
          startLine: index,
          endLine: index
        };
      }
    });
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  };

  const renderLineNumber = (num: number) => (
    <span className="text-xs text-gray-500 w-12 inline-block text-right pr-2 select-none">
      {num}
    </span>
  );
  
  const getOperationBadge = () => {
    switch (diff.operation) {
      case 'create':
        return <Badge className="bg-green-500">Created</Badge>;
      case 'update':
        return <Badge className="bg-blue-500">Modified</Badge>;
      case 'delete':
        return <Badge className="bg-red-500">Deleted</Badge>;
      default:
        return null;
    }
  };
  
  const renderUnifiedView = () => {
    if (!diff.changes) return null;
    
    if (showAll) {
      return (
        <ScrollArea className="h-96">
          <div className="font-mono text-sm p-1">
            {diff.changes.map((change, index) => {
              const isAnimated = animatedLines.includes(index);
              
              return (
                <motion.div
                  key={`${change.lineNumber}-${index}`}
                  initial={change.type !== 'unchanged' ? { opacity: 0, x: change.type === 'add' ? 20 : -20 } : { opacity: 1 }}
                  animate={isAnimated ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    change.type === 'add' 
                      ? 'bg-green-50 text-green-800' 
                      : change.type === 'remove' 
                        ? 'bg-red-50 text-red-800' 
                        : ''
                  }`}
                >
                  {renderLineNumber(change.lineNumber)}
                  <pre className="flex-1 whitespace-pre-wrap pl-2 border-l">
                    {change.type === 'add' && <span className="text-green-600">+</span>}
                    {change.type === 'remove' && <span className="text-red-600">-</span>}
                    {change.type === 'unchanged' && <span className="text-gray-400">&nbsp;</span>}
                    {change.content}
                  </pre>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      );
    }
    
    // Collapsed view with expandable sections
    const sections = getSections();
    
    return (
      <ScrollArea className="h-96">
        <div className="font-mono text-sm p-1">
          {sections.map((section, sectionIndex) => {
            const isExpanded = expandedSections.includes(sectionIndex);
            
            if (section.type === 'unchanged' && section.lines.length > 3 && !isExpanded) {
              // Show collapsed unchanged section
              return (
                <div key={`section-${sectionIndex}`} className="py-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleSection(sectionIndex)}
                    className="w-full justify-start text-xs text-gray-500 hover:bg-gray-100"
                  >
                    {isExpanded ? <ChevronDown className="h-3 w-3 mr-1" /> : <ChevronRight className="h-3 w-3 mr-1" />}
                    {section.lines.length} unchanged lines
                  </Button>
                </div>
              );
            }
            
            // Show all lines in this section
            return (
              <React.Fragment key={`section-${sectionIndex}`}>
                {section.type === 'unchanged' && section.lines.length > 3 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleSection(sectionIndex)}
                    className="w-full justify-start text-xs text-gray-500 hover:bg-gray-100 mb-1"
                  >
                    {isExpanded ? <ChevronDown className="h-3 w-3 mr-1" /> : <ChevronRight className="h-3 w-3 mr-1" />}
                    Hide {section.lines.length} unchanged lines
                  </Button>
                )}
                
                {section.lines.map((change, lineIndex) => {
                  const globalIndex = section.startLine + lineIndex;
                  const isAnimated = animatedLines.includes(globalIndex);
                  
                  return (
                    <motion.div
                      key={`${change.lineNumber}-${globalIndex}`}
                      initial={change.type !== 'unchanged' ? { opacity: 0, x: change.type === 'add' ? 20 : -20 } : { opacity: 1 }}
                      animate={isAnimated ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.3 }}
                      className={`flex ${
                        change.type === 'add' 
                          ? 'bg-green-50 text-green-800' 
                          : change.type === 'remove' 
                            ? 'bg-red-50 text-red-800' 
                            : ''
                      }`}
                    >
                      {renderLineNumber(change.lineNumber)}
                      <pre className="flex-1 whitespace-pre-wrap pl-2 border-l">
                        {change.type === 'add' && <span className="text-green-600">+</span>}
                        {change.type === 'remove' && <span className="text-red-600">-</span>}
                        {change.type === 'unchanged' && <span className="text-gray-400">&nbsp;</span>}
                        {change.content}
                      </pre>
                    </motion.div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </ScrollArea>
    );
  };
  
  const renderSplitView = () => {
    if (!diff.previousContent && !diff.newContent) return null;
    
    return (
      <div className="grid grid-cols-2 gap-4 h-96">
        <div className="border rounded">
          <div className="p-2 border-b bg-gray-50">
            <h3 className="text-sm font-medium">Original</h3>
          </div>
          <ScrollArea className="h-[calc(100%-36px)]">
            <pre className="text-sm p-2 font-mono whitespace-pre-wrap">
              {diff.previousContent || 'New file'}
            </pre>
          </ScrollArea>
        </div>
        <div className="border rounded">
          <div className="p-2 border-b bg-gray-50">
            <h3 className="text-sm font-medium">Modified</h3>
          </div>
          <ScrollArea className="h-[calc(100%-36px)]">
            <pre className="text-sm p-2 font-mono whitespace-pre-wrap">
              {diff.newContent || 'File deleted'}
            </pre>
          </ScrollArea>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full border shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <File className="h-5 w-5" />
            <span className="text-sm font-mono truncate max-w-md">{diff.filePath}</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            {getOperationBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Tabs defaultValue="unified" className="w-[200px]" onValueChange={(v) => setView(v as 'unified' | 'split')}>
              <TabsList>
                <TabsTrigger value="unified">Unified</TabsTrigger>
                <TabsTrigger value="split">Split</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="text-xs"
              >
                {showAll ? 'Collapse Unchanged' : 'Show All'}
              </Button>
              
              {onViewOriginal && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewOriginal}
                  className="text-xs"
                >
                  Open File
                </Button>
              )}
            </div>
          </div>
          
          <div>
            {view === 'unified' ? renderUnifiedView() : renderSplitView()}
          </div>
          
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onReject}
              className="border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onApprove}
              className="border-green-300 hover:bg-green-50 hover:text-green-600"
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualDiffView; 