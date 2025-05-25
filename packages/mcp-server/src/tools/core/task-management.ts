import { ToolResult, TaskItem, TodoList } from '../../types';

export class TaskManagement {
  async createTodoList(params: {
    title: string;
    description?: string;
    requirements: string;
    projectPath?: string;
  }): Promise<ToolResult> {
    try {
      const tasks = await this.parseRequirementsIntoTasks(params.requirements);
      
      const todoList: TodoList = {
        id: this.generateId(),
        title: params.title,
        description: params.description,
        projectPath: params.projectPath,
        tasks,
        metadata: {
          totalTasks: tasks.length,
          completedTasks: 0,
          progressPercentage: 0,
          estimatedTotalTime: tasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0),
          actualTimeSpent: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      return {
        success: true,
        result: {
          todoList,
          summary: {
            totalTasks: tasks.length,
            phases: this.groupTasksByPhase(tasks),
            estimatedTime: todoList.metadata.estimatedTotalTime
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create todo list: ${error.message}`
      };
    }
  }  private async parseRequirementsIntoTasks(requirements: string): Promise<TaskItem[]> {
    const tasks: TaskItem[] = [];
    const lines = requirements.split('\n').filter(line => line.trim());
    
    let currentPhase = 'General';
    let taskCounter = 1;

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (this.isPhaseHeader(trimmed)) {
        currentPhase = this.extractPhaseTitle(trimmed);
        continue;
      }

      if (this.isTaskItem(trimmed)) {
        const task = this.parseTaskFromLine(trimmed, currentPhase, taskCounter++);
        tasks.push(task);
      }
    }

    return tasks;
  }

  private isPhaseHeader(line: string): boolean {
    return /^#{1,3}\s+/.test(line) || /^Phase\s+\d+/i.test(line);
  }

  private extractPhaseTitle(line: string): string {
    return line.replace(/^#{1,3}\s+/, '').replace(/^Phase\s+\d+:\s*/i, '');
  }

  private isTaskItem(line: string): boolean {
    return /^[-*+]\s+/.test(line) || /^\d+\.\s+/.test(line);
  }

  private parseTaskFromLine(line: string, phase: string, counter: number): TaskItem {
    const taskText = line.replace(/^[-*+]\s+/, '').replace(/^\d+\.\s+/, '');
    const priority = this.detectPriority(taskText);
    const estimatedTime = this.estimateTaskTime(taskText);
    
    return {
      id: `task-${counter}`,
      title: taskText,
      status: 'pending',
      priority,
      estimatedTime,
      tags: [phase.toLowerCase()],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private detectPriority(text: string): 'low' | 'medium' | 'high' | 'critical' {
    if (/critical|urgent|must|required/i.test(text)) return 'critical';
    if (/important|should|high/i.test(text)) return 'high';
    if (/could|nice|optional/i.test(text)) return 'low';
    return 'medium';
  }

  private estimateTaskTime(text: string): number {
    // Simple heuristic for time estimation (in minutes)
    const wordCount = text.split(' ').length;
    if (wordCount < 5) return 30;
    if (wordCount < 10) return 60;
    if (wordCount < 20) return 120;
    return 240;
  }  private generateId(): string {
    return 'todo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  private groupTasksByPhase(tasks: TaskItem[]): Record<string, TaskItem[]> {
    const phases: Record<string, TaskItem[]> = {};
    
    tasks.forEach(task => {
      const phase = task.tags?.[0] || 'general';
      if (!phases[phase]) {
        phases[phase] = [];
      }
      phases[phase].push(task);
    });
    
    return phases;
  }
}