import { SecurityContext } from '../types';
export declare class SandboxExecutor {
    private securityContext;
    constructor(securityContext: SecurityContext);
    executeCommand(command: string, options?: {
        timeout?: number;
        cwd?: string;
        env?: Record<string, string>;
    }): Promise<{
        stdout: string;
        stderr: string;
        exitCode: number;
    }>;
    private isCommandAllowed;
    executePython(script: string, options?: {
        timeout?: number;
        cwd?: string;
    }): Promise<{
        stdout: string;
        stderr: string;
        exitCode: number;
    }>;
    private sanitizePythonScript;
}
//# sourceMappingURL=sandbox-executor.d.ts.map