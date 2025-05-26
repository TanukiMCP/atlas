"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SandboxExecutor = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class SandboxExecutor {
    securityContext;
    constructor(securityContext) {
        this.securityContext = securityContext;
    }
    async executeCommand(command, options = {}) {
        if (!this.securityContext.sandboxMode) {
            throw new Error('Sandbox mode is disabled');
        }
        if (!this.isCommandAllowed(command)) {
            throw new Error('Command not allowed in sandbox mode');
        }
        try {
            const { stdout, stderr } = await execAsync(command, {
                timeout: options.timeout || 30000,
                cwd: options.cwd,
                env: { ...process.env, ...options.env },
                maxBuffer: 1024 * 1024
            });
            return { stdout, stderr, exitCode: 0 };
        }
        catch (error) {
            return {
                stdout: '',
                stderr: error.message,
                exitCode: error.code || 1
            };
        }
    }
    isCommandAllowed(command) {
        const dangerous = [
            'rm -rf',
            'del /f',
            'format',
            'fdisk',
            'sudo',
            'su ',
            'chmod 777',
            'chown',
            'kill -9',
            'shutdown',
            'reboot'
        ];
        return !dangerous.some(danger => command.includes(danger));
    }
    async executePython(script, options = {}) {
        const safeScript = this.sanitizePythonScript(script);
        return this.executeCommand(`python -c "${safeScript}"`, options);
    }
    sanitizePythonScript(script) {
        // Remove dangerous imports and functions
        const forbidden = [
            'import os',
            'import subprocess',
            'import sys',
            '__import__',
            'exec(',
            'eval(',
            'open('
        ];
        let sanitized = script;
        forbidden.forEach(item => {
            sanitized = sanitized.replace(new RegExp(item, 'g'), '');
        });
        return sanitized;
    }
}
exports.SandboxExecutor = SandboxExecutor;
//# sourceMappingURL=sandbox-executor.js.map