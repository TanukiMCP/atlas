"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolIndexer = void 0;
class ToolIndexer {
    searchIndex;
    categoryIndex = {};
    tagIndex = {};
    sourceIndex = {};
    constructor() {
        this.searchIndex = {
            nameIndex: new Map(),
            descriptionIndex: new Map(),
            tagIndex: new Map(),
            categoryIndex: new Map(),
            keywordIndex: new Map()
        };
    }
    async buildIndex(tools) {
        console.log(`Building search index for ${tools.length} tools...`);
        // Clear existing indexes
        this.clearIndexes();
        for (const tool of tools) {
            await this.indexTool(tool);
        }
        console.log('Search index built successfully');
    }
    clearIndexes() {
        this.searchIndex.nameIndex.clear();
        this.searchIndex.descriptionIndex.clear();
        this.searchIndex.tagIndex.clear();
        this.searchIndex.categoryIndex.clear();
        this.searchIndex.keywordIndex.clear();
        this.categoryIndex = {};
        this.tagIndex = {};
        this.sourceIndex = {};
    }
    async indexTool(tool) {
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
    indexByField(tool, fieldType, value, index) {
        const normalizedValue = this.normalizeSearchTerm(value);
        // Index the full term
        if (!index.has(normalizedValue)) {
            index.set(normalizedValue, []);
        }
        index.get(normalizedValue).push(tool);
        // Index individual words
        const words = normalizedValue.split(/\s+/).filter(word => word.length > 2);
        for (const word of words) {
            if (!index.has(word)) {
                index.set(word, []);
            }
            index.get(word).push(tool);
        }
    }
    normalizeSearchTerm(term) {
        return term.toLowerCase()
            .replace(/[^\w\s]/g, ' ') // Replace non-word chars with spaces
            .replace(/\s+/g, ' ') // Collapse multiple spaces
            .trim();
    }
    extractKeywords(description, tags) {
        const text = `${description} ${tags.join(' ')}`;
        const words = text.toLowerCase().match(/\b\w{3,}\b/g) || [];
        // Filter common stop words
        const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'she', 'use', 'way', 'why', 'ask', 'men', 'run', 'try']);
        return [...new Set(words.filter(word => !stopWords.has(word)))];
    }
    searchByCategory(categoryId) {
        return this.categoryIndex[categoryId] || [];
    }
    searchByTag(tag) {
        return this.tagIndex[tag] || [];
    }
    searchBySource(sourceId) {
        return this.sourceIndex[sourceId] || [];
    }
    findSimilarTools(tool, maxResults = 5) {
        const similar = [];
        // Find tools with same category
        const categoryTools = this.searchByCategory(tool.category.id)
            .filter(t => t.id !== tool.id);
        similar.push(...categoryTools.slice(0, maxResults));
        // Find tools with overlapping tags
        for (const tag of tool.tags) {
            const tagTools = this.searchByTag(tag)
                .filter(t => t.id !== tool.id && !similar.includes(t));
            similar.push(...tagTools.slice(0, Math.max(0, maxResults - similar.length)));
            if (similar.length >= maxResults)
                break;
        }
        return similar.slice(0, maxResults);
    }
    getIndexStats() {
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
    async rebuildIndex(tools) {
        await this.buildIndex(tools);
    }
}
exports.ToolIndexer = ToolIndexer;
//# sourceMappingURL=tool-indexer.js.map