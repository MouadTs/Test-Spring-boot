export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  projectId: number;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED'
} 