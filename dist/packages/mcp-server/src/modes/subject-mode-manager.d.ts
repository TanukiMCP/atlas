import { SubjectMode } from '../types';
export declare class SubjectModeManager {
    private currentMode;
    private availableModes;
    constructor();
    private initializeModes;
    switchMode(modeId: string): Promise<void>;
    getCurrentMode(): SubjectMode;
    getAvailableModes(): SubjectMode[];
    private saveUserModePreference;
    private updateToolAvailability;
}
//# sourceMappingURL=subject-mode-manager.d.ts.map