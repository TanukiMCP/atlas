"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemCRUD = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_validator_1 = require("../../security/path-validator");
class FileSystemCRUD {
    pathValidator;
    constructor() {
        this.pathValidator = new path_validator_1.PathValidator({
            allowedPaths: [],
            deniedPaths: ['/system', '/windows', '/etc'],
            maxFileSize: 10 * 1024 * 1024,
            allowedOperations: ['read', 'write', 'create', 'delete', 'list'],
            sandboxMode: true
        });
    }
    async createDirectory(params) {
        try {
            const validation = this.pathValidator.validatePath(params.path);
            if (!validation.valid) {
                return { success: false, error: validation.error };
            }
            await promises_1.default.mkdir(params.path, { recursive: params.recursive });
            return {
                success: true,
                result: {
                    path: params.path,
                    created: true,
                    recursive: params.recursive
                }
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Failed to create directory: ${error.message}`
            };
        }
    }
    async deleteFile(params) {
        try {
            const validation = this.pathValidator.validatePath(params.path);
            if (!validation.valid) {
                return { success: false, error: validation.error };
            }
            if (params.backup) {
                const backupPath = params.path + '.backup.' + Date.now();
                await promises_1.default.copyFile(params.path, backupPath);
            }
            await promises_1.default.unlink(params.path);
            return {
                success: true,
                result: {
                    path: params.path,
                    deleted: true,
                    backup: params.backup
                }
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Failed to delete file: ${error.message}`
            };
        }
    }
}
exports.FileSystemCRUD = FileSystemCRUD;
//# sourceMappingURL=filesystem-crud.js.map