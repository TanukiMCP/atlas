import { ToolResult } from '../../types';
export declare class LanguageTools {
    translateText(params: {
        text: string;
        fromLanguage?: string;
        toLanguage: string;
        includeContext?: boolean;
        includeCultural?: boolean;
        formality?: 'formal' | 'informal' | 'auto';
    }): Promise<ToolResult>;
    checkGrammar(params: {
        text: string;
        language?: string;
        checkStyle?: boolean;
        checkClarity?: boolean;
        targetAudience?: 'academic' | 'business' | 'casual';
    }): Promise<ToolResult>;
    private performTranslation;
    private performGrammarCheck;
    pronunciationGuide(params: {
        text: string;
        language: string;
        includeIPA?: boolean;
    }): Promise<ToolResult>;
    vocabularyBuilder(params: {
        word: string;
        language: string;
        includeExamples?: boolean;
    }): Promise<ToolResult>;
}
//# sourceMappingURL=languages.d.ts.map