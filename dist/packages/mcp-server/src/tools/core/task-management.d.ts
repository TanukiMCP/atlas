import { ToolResult } from '../../types';
export declare class TaskManagement {
    createTodoList(params: {
        title: string;
        description?: string;
        requirements: string;
        projectPath?: string;
    }): Promise<ToolResult>;
    private parseRequirementsIntoTasks;
    private isPhaseHeader;
    private extractPhaseTitle;
    private isTaskItem;
    private parseTaskFromLine;
    private detectPriority;
    private estimateTaskTime;
    private generateId;
    private groupTasksByPhase;
}
//# sourceMappingURL=task-management.d.ts.map