import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { User } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<User | null>(JSON.parse(localStorage.getItem('taskflow_user') || 'null'));
  constructor(private http: HttpClient) {}
  login(payload: { email: string; password: string }) { return this.http.post<{token: string; user: User}>('/api/auth/login', payload).pipe(tap(data => this.persist(data))); }
  register(payload: { name: string; email: string; password: string }) { return this.http.post<{token: string; user: User}>('/api/auth/register', payload).pipe(tap(data => this.persist(data))); }
  logout() { localStorage.removeItem('taskflow_token'); localStorage.removeItem('taskflow_user'); this.user.set(null); }
  private persist(data: { token: string; user: User }) { localStorage.setItem('taskflow_token', data.token); localStorage.setItem('taskflow_user', JSON.stringify(data.user)); this.user.set(data.user); }
}
