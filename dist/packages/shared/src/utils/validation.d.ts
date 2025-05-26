export declare function isValidString(value: any, minLength?: number, maxLength?: number): boolean;
export declare function isValidNumber(value: any, min?: number, max?: number): boolean;
export declare function isValidArray(value: any, minLength?: number, maxLength?: number): boolean;
export declare function isValidObject(value: any): boolean;
export declare function isValidEmail(email: string): boolean;
export declare function isValidUUID(uuid: string): boolean;
export declare function isValidPath(path: string): boolean;
export declare function isValidFilename(filename: string): boolean;
export declare function isValidURL(url: string): boolean;
export declare function validateProject(project: any): {
    isValid: boolean;
    errors: string[];
};
export declare function validateChatSession(session: any): {
    isValid: boolean;
    errors: string[];
};
export declare function validateChatMessage(message: any): {
    isValid: boolean;
    errors: string[];
};
export declare function validateMCPServer(server: any): {
    isValid: boolean;
    errors: string[];
};
export declare function validateSubjectMode(mode: any): {
    isValid: boolean;
    errors: string[];
};
export declare function validateSetting(setting: any): {
    isValid: boolean;
    errors: string[];
};
export declare function validateData<T>(data: any, validator: (data: any) => {
    isValid: boolean;
    errors: string[];
}): {
    isValid: boolean;
    errors: string[];
    data?: T;
};
export declare function sanitizeString(str: string, maxLength?: number): string;
export declare function sanitizeHtml(html: string): string;
export declare function sanitizePath(path: string): string;
export declare class RateLimiter {
    private maxRequests;
    private windowMs;
    private requests;
    constructor(maxRequests: number, windowMs: number);
    canMakeRequest(identifier: string): boolean;
    reset(identifier?: string): void;
}
export declare class ValidationError extends Error {
    field: string;
    value: any;
    constructor(message: string, field: string, value: any);
}
export declare function createValidationError(field: string, value: any, message: string): ValidationError;
export declare function isProject(obj: any): obj is {
    name: string;
    path: string;
};
export declare function isChatSession(obj: any): obj is {
    title: string;
    subjectMode: string;
};
export declare function isChatMessage(obj: any): obj is {
    role: string;
    content: string;
    sessionId: string;
};
//# sourceMappingURL=validation.d.ts.map