import { SubjectMode } from '../types/subject-types';
export declare const useSubjectMode: () => {
    currentMode: string;
    availableModes: SubjectMode[];
    switchMode: (modeId: string) => void;
    getCurrentModeConfig: () => SubjectMode | undefined;
};
//# sourceMappingURL=use-subject-mode.d.ts.map