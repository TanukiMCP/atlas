import React, { useState, useEffect } from 'react';
import { editMenuService, EditState, SearchState } from '../../services/edit-menu-service';

/**
 * Edit Menu Demo Component
 * Demonstrates all the functionality of the Edit Menu Service
 */
export const EditMenuDemo: React.FC = () => {
  const [editState, setEditState] = useState<EditState>();
  const [searchState, setSearchState] = useState<SearchState>();
  const [textContent, setTextContent] = useState(`
Welcome to the TanukiMCP Atlas Edit Menu Demo!

This demo showcases the comprehensive Edit functionality:

1. Undo/Redo Operations
   - Full state tracking
   - Unlimited undo history (up to 100 actions)
   - Smart action grouping

2. Clipboard Operations  
   - Cut, Copy, Paste with modern clipboard API
   - Automatic text selection detection
   - Context-aware paste operations

3. Search and Replace
   - Regular expression support
   - Case-sensitive options
   - Find next/previous navigation
   - Replace one or replace all

4. Text Selection
   - Select All functionality
   - Smart context detection
   - Multiple element support

Try editing this text and using the Edit menu functions!
You can also use keyboard shortcuts:
- Ctrl+Z: Undo
- Ctrl+Y: Redo  
- Ctrl+X: Cut
- Ctrl+C: Copy
- Ctrl+V: Paste
- Ctrl+A: Select All
- Ctrl+F: Find
- Ctrl+H: Replace
  `);

  // Update state every 500ms to show real-time status
  useEffect(() => {
    const updateState = () => {
      setEditState(editMenuService.getEditState());
      setSearchState(editMenuService.getSearchState());
    };

    updateState();
    const interval = setInterval(updateState, 500);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    const term = prompt('Search for:');
    if (term) {
      await editMenuService.search(term, { matchCase: false, useRegex: false });
    }
  };

  const handleReplaceAll = async () => {
    const searchTerm = prompt('Find:');
    if (searchTerm) {
      const replaceTerm = prompt('Replace with:') || '';
      await editMenuService.search(searchTerm, { matchCase: false, useRegex: false });
      await editMenuService.replaceAll(replaceTerm);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#2563eb', marginBottom: '20px' }}>
        🧠 Edit Menu Service Demo
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Main Text Area */}
        <div>
          <h3>📝 Interactive Text Editor</h3>
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            style={{
              width: '100%',
              height: '400px',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              lineHeight: '1.5',
              fontFamily: 'ui-monospace, Monaco, "Cascadia Code", "Roboto Mono", monospace',
              resize: 'vertical'
            }}
            placeholder="Start typing here or paste some text to test the Edit functionality..."
          />
          
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => editMenuService.undo()}
              disabled={!editState?.canUndo}
              style={{
                padding: '8px 16px',
                backgroundColor: editState?.canUndo ? '#3b82f6' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: editState?.canUndo ? 'pointer' : 'not-allowed'
              }}
            >
              ↶ Undo
            </button>
            
            <button 
              onClick={() => editMenuService.redo()}
              disabled={!editState?.canRedo}
              style={{
                padding: '8px 16px',
                backgroundColor: editState?.canRedo ? '#3b82f6' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: editState?.canRedo ? 'pointer' : 'not-allowed'
              }}
            >
              ↷ Redo
            </button>
            
            <button 
              onClick={() => editMenuService.cut()}
              disabled={!editState?.canCut}
              style={{
                padding: '8px 16px',
                backgroundColor: editState?.canCut ? '#dc2626' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: editState?.canCut ? 'pointer' : 'not-allowed'
              }}
            >
              ✂️ Cut
            </button>
            
            <button 
              onClick={() => editMenuService.copy()}
              disabled={!editState?.canCopy}
              style={{
                padding: '8px 16px',
                backgroundColor: editState?.canCopy ? '#059669' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: editState?.canCopy ? 'pointer' : 'not-allowed'
              }}
            >
              📋 Copy
            </button>
            
            <button 
              onClick={() => editMenuService.paste()}
              disabled={!editState?.canPaste}
              style={{
                padding: '8px 16px',
                backgroundColor: editState?.canPaste ? '#7c3aed' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: editState?.canPaste ? 'pointer' : 'not-allowed'
              }}
            >
              📌 Paste
            </button>
            
            <button 
              onClick={() => editMenuService.selectAll()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              🔘 Select All
            </button>
          </div>

          <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={handleSearch}
              style={{
                padding: '8px 16px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              🔍 Search
            </button>
            
            <button 
              onClick={handleReplaceAll}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ea580c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              🔄 Replace All
            </button>
            
            {searchState?.searchResults && searchState.searchResults.length > 0 && (
              <>
                <button 
                  onClick={() => editMenuService.findNext()}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#0ea5e9',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  ⬇️ Find Next
                </button>
                
                <button 
                  onClick={() => editMenuService.findPrevious()}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#0ea5e9',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  ⬆️ Find Previous
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Status Panel */}
        <div>
          <h3>📊 Edit State Status</h3>
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '14px'
          }}>
            <h4 style={{ marginTop: 0, color: '#475569' }}>Current Capabilities:</h4>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Can Undo:</span>
                <span style={{ color: editState?.canUndo ? '#059669' : '#dc2626' }}>
                  {editState?.canUndo ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Can Redo:</span>
                <span style={{ color: editState?.canRedo ? '#059669' : '#dc2626' }}>
                  {editState?.canRedo ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Can Cut:</span>
                <span style={{ color: editState?.canCut ? '#059669' : '#dc2626' }}>
                  {editState?.canCut ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Can Copy:</span>
                <span style={{ color: editState?.canCopy ? '#059669' : '#dc2626' }}>
                  {editState?.canCopy ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Can Paste:</span>
                <span style={{ color: editState?.canPaste ? '#059669' : '#dc2626' }}>
                  {editState?.canPaste ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Has Selection:</span>
                <span style={{ color: editState?.hasSelection ? '#059669' : '#dc2626' }}>
                  {editState?.hasSelection ? '✅ Yes' : '❌ No'}
                </span>
              </div>
            </div>
            
            {editState?.selectedText && (
              <div style={{ marginTop: '12px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#475569' }}>Selected Text:</h4>
                <div style={{
                  backgroundColor: '#fef3c7',
                  padding: '8px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  maxHeight: '60px',
                  overflow: 'auto'
                }}>
                  "{editState.selectedText}"
                </div>
              </div>
            )}
            
            <div style={{ marginTop: '12px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#475569' }}>Stack Sizes:</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Undo Stack:</span>
                <span>{editMenuService.getUndoStackSize()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Redo Stack:</span>
                <span>{editMenuService.getRedoStackSize()}</span>
              </div>
            </div>
          </div>
          
          {searchState?.searchResults && searchState.searchResults.length > 0 && (
            <div style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '8px',
              padding: '16px',
              marginTop: '16px',
              fontSize: '14px'
            }}>
              <h4 style={{ marginTop: 0, color: '#047857' }}>🔍 Search Results:</h4>
              <p>Found {searchState.searchResults.length} matches for "{searchState.searchTerm}"</p>
              {searchState.currentResultIndex >= 0 && (
                <p>Currently viewing result {searchState.currentResultIndex + 1} of {searchState.searchResults.length}</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div style={{
        backgroundColor: '#f1f5f9',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        padding: '16px',
        marginTop: '20px'
      }}>
        <h3 style={{ marginTop: 0, color: '#334155' }}>🎯 How to Test the Edit Menu</h3>
        <ol style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
          <li><strong>Text Editing:</strong> Type in the textarea above and use Ctrl+Z/Ctrl+Y to undo/redo</li>
          <li><strong>Selection:</strong> Select some text to enable Cut/Copy operations</li>
          <li><strong>Clipboard:</strong> Cut or copy text, then paste it elsewhere</li>
          <li><strong>Search:</strong> Click the Search button to find text within the content</li>
          <li><strong>Replace:</strong> Use Replace All to substitute text throughout the document</li>
          <li><strong>Keyboard Shortcuts:</strong> All standard shortcuts work (Ctrl+Z, Ctrl+C, etc.)</li>
          <li><strong>Real-time Status:</strong> Watch the status panel update as you interact with the text</li>
        </ol>
        
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#dbeafe', borderRadius: '6px' }}>
          <strong>💡 Pro Tip:</strong> The Edit Menu Service integrates seamlessly with the main application toolbar. 
          All these functions are also available through the Edit menu in the top menubar!
        </div>
      </div>
    </div>
  );
}; 