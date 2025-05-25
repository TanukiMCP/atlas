import Fuse from 'fuse.js';
import { UnifiedTool, ToolScore, ScoreFactor } from '../types/tool-router-types';

export interface SearchOptions {
  threshold?: number;
  maxResults?: number;
  includeMatches?: boolean;
  keys?: string[];
}

export class FuzzySearch {
  private fuse: Fuse<UnifiedTool>;
  private tools: UnifiedTool[] = [];
  private searchOptions: Fuse.IFuseOptions<UnifiedTool>;

  constructor() {
    this.searchOptions = {
      includeScore: true,
      includeMatches: true,
      threshold: 0.3, // Lower = more strict matching
      distance: 100,
      minMatchCharLength: 2,
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'tags', weight: 0.2 },
        { name: 'category.name', weight: 0.1 }
      ],
      ignoreLocation: true,
      findAllMatches: true
    };

    this.fuse = new Fuse([], this.searchOptions);
  }

  async updateIndex(tools: UnifiedTool[]): Promise<void> {
    this.tools = tools;
    this.fuse = new Fuse(tools, this.searchOptions);
    console.log(`Updated search index with ${tools.length} tools`);
  }

  async search(query: string, tools?: UnifiedTool[], options?: SearchOptions): Promise<UnifiedTool[]> {
    const searchTools = tools || this.tools;
    
    if (!query.trim()) {
      // Return most recently used tools when no query
      return searchTools
        .filter(tool => tool.lastUsed)
        .sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0))
        .slice(0, options?.maxResults || 10);
    }

    // Create a temporary fuse instance if different tools provided
    const fuseInstance = tools ? new Fuse(tools, this.searchOptions) : this.fuse;
    
    const results = fuseInstance.search(query, {
      limit: options?.maxResults || 50
    });

    return results.map(result => result.item);
  }

  async searchWithScores(query: string, tools?: UnifiedTool[], options?: SearchOptions): Promise<ToolScore[]> {
    const searchTools = tools || this.tools;
    
    if (!query.trim()) {
      return searchTools.slice(0, options?.maxResults || 10).map(tool => ({
        tool,
        score: this.calculateRecencyScore(tool),
        factors: [
          {
            name: 'recency',
            score: this.calculateRecencyScore(tool),
            weight: 1.0,
            description: 'Recently used tools are prioritized'
          }
        ]
      }));
    }

    const fuseInstance = tools ? new Fuse(tools, this.searchOptions) : this.fuse;
    const results = fuseInstance.search(query, {
      limit: options?.maxResults || 50
    });

    return results.map(result => {
      const relevanceScore = 1 - (result.score || 0); // Fuse score is distance, so invert
      const factors: ScoreFactor[] = [];
      
      // Analyze match factors
      if (result.matches) {
        for (const match of result.matches) {
          const fieldWeight = this.getFieldWeight(match.key);
          const matchScore = this.calculateMatchScore(match);
          
          factors.push({
            name: match.key,
            score: matchScore,
            weight: fieldWeight,
            description: `Match in ${match.key}: ${match.value?.substring(0, 50)}...`
          });
        }
      }

      // Add usage and performance factors
      const usageScore = Math.min(result.item.usageCount / 100, 1);
      const performanceScore = result.item.successRate / 100;
      
      factors.push(
        {
          name: 'usage',
          score: usageScore,
          weight: 0.1,
          description: `Used ${result.item.usageCount} times`
        },
        {
          name: 'performance',
          score: performanceScore,
          weight: 0.1,
          description: `${result.item.successRate}% success rate`
        }
      );

      // Calculate weighted total score
      const totalScore = factors.reduce((sum, factor) => sum + (factor.score * factor.weight), 0) / 
                        factors.reduce((sum, factor) => sum + factor.weight, 0);

      return {
        tool: result.item,
        score: totalScore,
        factors
      };
    });
  }  getRelevanceScore(tool: UnifiedTool, query: string): number {
    if (!query.trim()) {
      return this.calculateRecencyScore(tool);
    }

    const results = this.fuse.search(query);
    const result = results.find(r => r.item.id === tool.id);
    
    if (!result) {
      return 0;
    }
    
    return 1 - (result.score || 0); // Convert distance to relevance
  }

  private calculateRecencyScore(tool: UnifiedTool): number {
    if (!tool.lastUsed) {
      return 0.1; // Low score for never used tools
    }
    
    const daysSinceUsed = (Date.now() - tool.lastUsed.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceUsed < 1) return 1.0;
    if (daysSinceUsed < 7) return 0.8;
    if (daysSinceUsed < 30) return 0.6;
    if (daysSinceUsed < 90) return 0.4;
    return 0.2;
  }

  private getFieldWeight(fieldKey: string): number {
    const weightMap: Record<string, number> = {
      'name': 0.4,
      'description': 0.3,
      'tags': 0.2,
      'category.name': 0.1
    };
    
    return weightMap[fieldKey] || 0.1;
  }

  private calculateMatchScore(match: Fuse.FuseResultMatch): number {
    if (!match.indices || match.indices.length === 0) {
      return 0;
    }
    
    const totalLength = match.value?.length || 0;
    if (totalLength === 0) {
      return 0;
    }
    
    // Calculate match coverage
    const matchedChars = match.indices.reduce((sum, [start, end]) => sum + (end - start + 1), 0);
    const coverage = matchedChars / totalLength;
    
    // Bonus for exact matches at word boundaries
    let wordBoundaryBonus = 0;
    if (match.indices.some(([start]) => start === 0 || /\s/.test(match.value?.[start - 1] || ''))) {
      wordBoundaryBonus = 0.2;
    }
    
    return Math.min(coverage + wordBoundaryBonus, 1.0);
  }

  async searchByCategory(query: string, categoryId: string, tools?: UnifiedTool[]): Promise<UnifiedTool[]> {
    const searchTools = (tools || this.tools).filter(tool => tool.category.id === categoryId);
    return this.search(query, searchTools);
  }

  async searchByTags(tags: string[], tools?: UnifiedTool[]): Promise<UnifiedTool[]> {
    const searchTools = (tools || this.tools).filter(tool => 
      tags.some(tag => tool.tags.includes(tag))
    );
    
    // Sort by tag match count
    return searchTools.sort((a, b) => {
      const aMatches = tags.filter(tag => a.tags.includes(tag)).length;
      const bMatches = tags.filter(tag => b.tags.includes(tag)).length;
      return bMatches - aMatches;
    });
  }

  async searchSimilar(tool: UnifiedTool, maxResults: number = 5): Promise<UnifiedTool[]> {
    // Create a query from the tool's metadata
    const query = `${tool.name} ${tool.description} ${tool.tags.join(' ')}`;
    
    const results = await this.search(query, undefined, { maxResults: maxResults + 1 });
    
    // Filter out the original tool
    return results.filter(result => result.id !== tool.id).slice(0, maxResults);
  }

  getSearchSuggestions(partialQuery: string, maxSuggestions: number = 5): string[] {
    if (!partialQuery.trim()) {
      return [];
    }
    
    const suggestions: Set<string> = new Set();
    
    // Add tool names that start with the query
    for (const tool of this.tools) {
      if (tool.name.toLowerCase().startsWith(partialQuery.toLowerCase())) {
        suggestions.add(tool.name);
      }
      
      // Add matching tags
      for (const tag of tool.tags) {
        if (tag.toLowerCase().startsWith(partialQuery.toLowerCase())) {
          suggestions.add(tag);
        }
      }
      
      if (suggestions.size >= maxSuggestions) {
        break;
      }
    }
    
    return Array.from(suggestions).slice(0, maxSuggestions);
  }
}