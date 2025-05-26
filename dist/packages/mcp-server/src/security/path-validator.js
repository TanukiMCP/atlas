"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathValidator = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class PathValidator {
    securityContext;
    constructor(securityContext) {
        this.securityContext = securityContext;
    }
    validatePath(filePath) {
        try {
            const normalizedPath = path_1.default.resolve(filePath);
            if (this.hasPathTraversal(filePath)) {
                return { valid: false, error: 'Path traversal detected' };
            }
            if (this.isDeniedPath(normalizedPath)) {
                return { valid: false, error: 'Access denied' };
            }
            if (this.securityContext.allowedPaths.length > 0) {
                if (!this.isAllowedPath(normalizedPath)) {
                    return { valid: false, error: 'Path not allowed' };
                }
            }
            if (fs_1.default.existsSync(normalizedPath)) {
                const stats = fs_1.default.statSync(normalizedPath);
                if (stats.size > this.securityContext.maxFileSize) {
                    return { valid: false, error: 'File too large' };
                }
            }
            return { valid: true };
        }
        catch (error) {
            return { valid: false, error: `Validation error: ${error.message}` };
        }
    }
    hasPathTraversal(filePath) {
        const dangerous = ['../', '..\\', '/../', '\\..\\'];
        return dangerous.some(pattern => filePath.includes(pattern));
    }
    isDeniedPath(normalizedPath) {
        return this.securityContext.deniedPaths.some(deniedPath => normalizedPath.startsWith(path_1.default.resolve(deniedPath)));
    }
    isAllowedPath(normalizedPath) {
        return this.securityContext.allowedPaths.some(allowedPath => normalizedPath.startsWith(path_1.default.resolve(allowedPath)));
    }
    validateOperation(operation) {
        return this.securityContext.allowedOperations.includes(operation);
    }
    createSecureContext(projectPath) {
        return {
            allowedPaths: [projectPath],
            deniedPaths: [
                '/system',
                '/windows',
                '/etc',
                '/root',
                '/usr/bin'
            ],
            maxFileSize: 10 * 1024 * 1024, // 10MB
            allowedOperations: ['read', 'write', 'create', 'list'],
            sandboxMode: true
        };
    }
}
exports.PathValidator = PathValidator;
//# sourceMappingURL=path-validator.js.map