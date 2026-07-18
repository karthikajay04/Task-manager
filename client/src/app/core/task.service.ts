import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskDraft } from './models';
import { API_URL } from './config';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}
  list() { return this.http.get<Task[]>(`${API_URL}/api/tasks`); }
  create(task: TaskDraft) { return this.http.post<Task>(`${API_URL}/api/tasks`, task); }
  update(id: string, task: Partial<TaskDraft>) { return this.http.patch<Task>(`${API_URL}/api/tasks/${id}`, task); }
  delete(id: string) { return this.http.delete(`${API_URL}/api/tasks/${id}`); }
}
