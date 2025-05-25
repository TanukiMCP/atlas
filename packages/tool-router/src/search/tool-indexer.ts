import { UnifiedTool, SearchIndex, ToolIndex } from '../types/tool-router-types';

export class ToolIndexer {
  private searchIndex: SearchIndex;
  private categoryIndex: ToolIndex = {};
  private tagIndex: ToolIndex = {};
  private sourceIndex: ToolIndex = {};

  constructor() {
    this.searchIndex = {
      nameIndex: new Map(),
      descriptionIndex: new Map(),
      tagIndex: new Map(),
      categoryIndex: new Map(),
      keywordIndex: new Map()
    };
  }

  async buildIndex(tools: UnifiedTool[]): Promise<void> {
    console.log(`Building search index for ${tools.length} tools...`);
    
    // Clear existing indexes
    this.clearIndexes();
    
    for (const tool of tools) {
      await this.indexTool(tool);
    }
    
    console.log('Search index built successfully');
  }

  private clearIndexes(): void {
    this.searchIndex.nameIndex.clear();
    this.searchIndex.descriptionIndex.clear();
    this.searchIndex.tagIndex.clear();
    this.searchIndex.categoryIndex.clear();
    this.searchIndex.keywordIndex.clear();
    
    this.categoryIndex = {};
    this.tagIndex = {};
    this.sourceIndex = {};
  }

  private async indexTool(tool: UnifiedTool): Promise<void> {
    // Index by name
    this.indexByField(tool, 'name', tool.name, this.searchIndex.nameIndex);
    
    // Index by description
    this.indexByField(tool, 'description', tool.description, this.searchIndex.descriptionIndex);
    
    // Index by tags
    for (const tag of tool.tags) {
      this.indexByField(tool, 'tag', tag, this.searchIndex.tagIndex);
      
      // Also build tag index
      if (!this.tagIndex[tag]) {
        this.tagIndex[tag] = [];
      }
      this.tagIndex[tag].push(tool);
    }
    
    // Index by category
    this.indexByField(tool, 'category', tool.category.name, this.searchIndex.categoryIndex);
    
    // Build category index
    if (!this.categoryIndex[tool.category.id]) {
      this.categoryIndex[tool.category.id] = [];
    }
    this.categoryIndex[tool.category.id].push(tool);
    
    // Index by source
    if (!this.sourceIndex[tool.source.id]) {
      this.sourceIndex[tool.source.id] = [];
    }
    this.sourceIndex[tool.source.id].push(tool);
    
    // Index by keywords (extracted from description and tags)
    const keywords = this.extractKeywords(tool.description, tool.tags);
    for (const keyword of keywords) {
      this.indexByField(tool, 'keyword', keyword, this.searchIndex.keywordIndex);
    }
  }

  private indexByField(
    tool: UnifiedTool, 
    fieldType: string, 
    value: string, 
    index: Map<string, UnifiedTool[]>
  ): void {
    const normalizedValue = this.normalizeSearchTerm(value);
    
    // Index the full term
    if (!index.has(normalizedValue)) {
      index.set(normalizedValue, []);
    }
    index.get(normalizedValue)!.push(tool);
    
    // Index individual words
    const words = normalizedValue.split(/\s+/).filter(word => word.length > 2);
    for (const word of words) {
      if (!index.has(word)) {
        index.set(word, []);
      }
      index.get(word)!.push(tool);
    }
  }

  private normalizeSearchTerm(term: string): string {
    return term.toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Replace non-word chars with spaces
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .trim();
  }

  private extractKeywords(description: string, tags: string[]): string[] {
    const text = `${description} ${tags.join(' ')}`;
    const words = text.toLowerCase().match(/\b\w{3,}\b/g) || [];
    
    // Filter common stop words
    const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'she', 'use', 'way', 'why', 'ask', 'men', 'run', 'try']);
    
    return [...new Set(words.filter(word => !stopWords.has(word)))];
  }

  searchByCategory(categoryId: string): UnifiedTool[] {
    return this.categoryIndex[categoryId] || [];
  }

  searchByTag(tag: string): UnifiedTool[] {
    return this.tagIndex[tag] || [];
  }

  searchBySource(sourceId: string): UnifiedTool[] {
    return this.sourceIndex[sourceId] || [];
  }

  findSimilarTools(tool: UnifiedTool, maxResults: number = 5): UnifiedTool[] {
    const similar: UnifiedTool[] = [];
    
    // Find tools with same category
    const categoryTools = this.searchByCategory(tool.category.id)
      .filter(t => t.id !== tool.id);
    similar.push(...categoryTools.slice(0, maxResults));
    
    // Find tools with overlapping tags
    for (const tag of tool.tags) {
      const tagTools = this.searchByTag(tag)
        .filter(t => t.id !== tool.id && !similar.includes(t));
      similar.push(...tagTools.slice(0, Math.max(0, maxResults - similar.length)));
      
      if (similar.length >= maxResults) break;
    }
    
    return similar.slice(0, maxResults);
  }

  getIndexStats(): any {
    return {
      totalTerms: {
        names: this.searchIndex.nameIndex.size,
        descriptions: this.searchIndex.descriptionIndex.size,
        tags: this.searchIndex.tagIndex.size,
        categories: this.searchIndex.categoryIndex.size,
        keywords: this.searchIndex.keywordIndex.size
      },
      categories: Object.keys(this.categoryIndex).length,
      tags: Object.keys(this.tagIndex).length,
      sources: Object.keys(this.sourceIndex).length
    };
  }

  async rebuildIndex(tools: UnifiedTool[]): Promise<void> {
    await this.buildIndex(tools);
  }
}