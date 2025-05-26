"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchOperations = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const path_validator_1 = require("../../security/path-validator");
class SearchOperations {
    pathValidator;
    constructor() {
        this.pathValidator = new path_validator_1.PathValidator({
            allowedPaths: [],
            deniedPaths: ['/system', '/windows', '/etc'],
            maxFileSize: 10 * 1024 * 1024,
            allowedOperations: ['read', 'list'],
            sandboxMode: true
        });
    }
    async searchFiles(params) {
        try {
            const validation = this.pathValidator.validatePath(params.directory);
            if (!validation.valid) {
                return { success: false, error: validation.error };
            }
            const results = [];
            await this.searchRecursive(params.directory, params.pattern, results, params.fileTypes);
            return {
                success: true,
                result: {
                    matches: results,
                    totalMatches: results.length
                }
            };
        }
        catch (error) {
            return { success: false, error: `Search failed: ${error.message}` };
        }
    }
    async searchRecursive(dir, pattern, results, fileTypes) {
        const items = await promises_1.default.readdir(dir, { withFileTypes: true });
        for (const item of items) {
            const fullPath = path_1.default.join(dir, item.name);
            if (item.isDirectory()) {
                await this.searchRecursive(fullPath, pattern, results, fileTypes);
            }
            else if (item.isFile()) {
                if (fileTypes && !fileTypes.some(ext => item.name.endsWith(ext))) {
                    continue;
                }
                try {
                    const content = await promises_1.default.readFile(fullPath, 'utf8');
                    if (content.includes(pattern)) {
                        results.push({
                            file: fullPath,
                            matches: this.findMatchesInContent(content, pattern)
                        });
                    }
                }
                catch (error) {
                    // Skip files that can't be read
                }
            }
        }
    }
    findMatchesInContent(content, pattern) {
        const lines = content.split('\n');
        const matches = [];
        lines.forEach((line, index) => {
            if (line.includes(pattern)) {
                matches.push({
                    line: index + 1,
                    content: line.trim(),
                    context: this.getLineContext(lines, index)
                });
            }
        });
        return matches;
    }
    getLineContext(lines, lineIndex) {
        const start = Math.max(0, lineIndex - 2);
        const end = Math.min(lines.length, lineIndex + 3);
        return {
            before: lines.slice(start, lineIndex),
            after: lines.slice(lineIndex + 1, end)
        };
    }
}
exports.SearchOperations = SearchOperations;
//# sourceMappingURL=search-operations.js.map