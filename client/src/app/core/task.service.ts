import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskDraft } from './models';
@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}
  list() { return this.http.get<Task[]>('/api/tasks'); }
  create(task: TaskDraft) { return this.http.post<Task>('/api/tasks', task); }
  update(id: string, task: Partial<TaskDraft>) { return this.http.patch<Task>(`/api/tasks/${id}`, task); }
  delete(id: string) { return this.http.delete(`/api/tasks/${id}`); }
}
