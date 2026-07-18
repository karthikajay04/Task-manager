export interface User { id: string; name: string; email: string; }
export interface Task { _id: string; title: string; notes: string; category: string; priority: 'low' | 'medium' | 'high'; dueDate?: string; completed: boolean; createdAt: string; }
export type TaskDraft = Omit<Task, '_id' | 'createdAt'>;
