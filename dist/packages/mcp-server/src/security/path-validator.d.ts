import { SecurityContext } from '../types';
export declare class PathValidator {
    private securityContext;
    constructor(securityContext: SecurityContext);
    validatePath(filePath: string): {
        valid: boolean;
        error?: string;
    };
    private hasPathTraversal;
    private isDeniedPath;
    private isAllowedPath;
    validateOperation(operation: string): boolean;
    createSecureContext(projectPath: string): SecurityContext;
}
//# sourceMappingURL=path-validator.d.ts.map