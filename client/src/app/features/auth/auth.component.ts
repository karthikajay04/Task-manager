import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-auth', imports: [FormsModule],
  template: `
  <main class="auth-page">
    <section class="auth-note">
      <div class="tape"></div><p class="eyebrow">TASKFLOW · YOUR GENTLE PLANNER</p>
      <h1>Make space<br>for what matters.</h1>
      <p class="intro">A small, beautiful place to collect the things you want to get done — one note at a time.</p>
      <div class="doodle">✦ &nbsp; today is a good day to begin</div>
    </section>
    <section class="auth-card">
      <span class="stamp">TF</span>
      <p class="eyebrow">{{ isRegister() ? 'NEW NOTEBOOK' : 'WELCOME BACK' }}</p>
      <h2>{{ isRegister() ? 'Start your list' : 'Open your notebook' }}</h2>
      <form (ngSubmit)="submit()">
        @if (isRegister()) { <label>Name<input name="name" [(ngModel)]="name" placeholder="How should we call you?" required></label> }
        <label>Email<input name="email" [(ngModel)]="email" type="email" placeholder="you@example.com" required></label>
        <label>Password<input name="password" [(ngModel)]="password" type="password" placeholder="At least 6 characters" required minlength="6"></label>
        @if (error()) { <p class="form-error">{{ error() }}</p> }
        <button class="primary" [disabled]="loading()">{{ loading() ? 'Just a moment…' : isRegister() ? 'Create my notebook →' : 'Sign in →' }}</button>
      </form>
      <p class="switch">{{ isRegister() ? 'Already have an account?' : 'New around here?' }} <button (click)="toggle()">{{ isRegister() ? 'Sign in' : 'Create one' }}</button></p>
    </section>
  </main>`
})
export class AuthComponent {
  isRegister = signal(false); loading = signal(false); error = signal(''); name = ''; email = ''; password = '';
  constructor(private auth: AuthService, private router: Router) {}
  toggle() { this.isRegister.update(v => !v); this.error.set(''); }
  submit() {
    this.loading.set(true); this.error.set('');
    const request = this.isRegister() ? this.auth.register({ name: this.name, email: this.email, password: this.password }) : this.auth.login({ email: this.email, password: this.password });
    request.subscribe({ next: () => this.router.navigateByUrl('/'), error: e => { this.error.set(e.error?.message || 'Could not reach your notebook.'); this.loading.set(false); } });
  }
}
