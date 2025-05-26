"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreFileOperations = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const path_validator_1 = require("../../security/path-validator");
class CoreFileOperations {
    pathValidator;
    constructor() {
        this.pathValidator = new path_validator_1.PathValidator({
            allowedPaths: [],
            deniedPaths: ['/system', '/windows', '/etc'],
            maxFileSize: 10 * 1024 * 1024,
            allowedOperations: ['read', 'write', 'create', 'list'],
            sandboxMode: true
        });
    }
    async readFile(params) {
        try {
            const validation = this.pathValidator.validatePath(params.path);
            if (!validation.valid) {
                return { success: false, error: validation.error };
            }
            const content = await promises_1.default.readFile(params.path, {
                encoding: params.encoding || 'utf8'
            });
            if (params.offset !== undefined || params.length !== undefined) {
                const lines = content.split('\n');
                const start = params.offset || 0;
                const end = params.length ? start + params.length : lines.length;
                const selectedLines = lines.slice(start, end);
                return {
                    success: true,
                    result: {
                        content: selectedLines.join('\n'),
                        totalLines: lines.length,
                        readLines: selectedLines.length
                    }
                };
            }
            return {
                success: true,
                result: { content, size: content.length, lines: content.split('\n').length }
            };
        }
        catch (error) {
            return { success: false, error: `Failed to read file: ${error.message}` };
        }
    }
    async writeFile(params) {
        try {
            const validation = this.pathValidator.validatePath(params.path);
            if (!validation.valid) {
                return { success: false, error: validation.error };
            }
            if (params.createDirs) {
                const dir = path_1.default.dirname(params.path);
                await promises_1.default.mkdir(dir, { recursive: true });
            }
            if (params.mode === 'append') {
                await promises_1.default.appendFile(params.path, params.content);
            }
            else {
                await promises_1.default.writeFile(params.path, params.content);
            }
            return {
                success: true,
                result: {
                    path: params.path,
                    size: params.content.length,
                    mode: params.mode || 'write'
                }
            };
        }
        catch (error) {
            return { success: false, error: `Failed to write file: ${error.message}` };
        }
    }
    async editBlock(params) {
        try {
            const validation = this.pathValidator.validatePath(params.path);
            if (!validation.valid) {
                return { success: false, error: validation.error };
            }
            const content = await promises_1.default.readFile(params.path, 'utf8');
            const matches = (content.match(new RegExp(params.oldContent, 'g')) || []).length;
            if (params.expectedMatches && matches !== params.expectedMatches) {
                return {
                    success: false,
                    error: `Expected ${params.expectedMatches} matches, found ${matches}`
                };
            }
            const newContent = content.replace(params.oldContent, params.newContent);
            await promises_1.default.writeFile(params.path, newContent);
            return {
                success: true,
                result: {
                    path: params.path,
                    matchesFound: matches,
                    replaced: matches > 0
                }
            };
        }
        catch (error) {
            return { success: false, error: `Failed to edit file: ${error.message}` };
        }
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
}
exports.CoreFileOperations = CoreFileOperations;
//# sourceMappingURL=file-operations.js.map