import { Component, computed, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Task, TaskDraft } from '../../core/models';
import { TaskService } from '../../core/task.service';

type Filter = 'all' | 'open' | 'done' | 'today';
@Component({ selector: 'app-dashboard', imports: [FormsModule, DatePipe], template: `
<main class="app-shell">
  <aside class="sidebar">
    <a class="logo" href="/">task<span>flow</span><i>✦</i></a>
    <div class="profile"><div class="avatar">{{ initials() }}</div><div><strong>{{ auth.user()?.name }}</strong><small>my notebook</small></div></div>
    <nav><button [class.active]="filter() === 'all'" (click)="filter.set('all')"><span>☷</span> All tasks <b>{{ tasks().length }}</b></button><button [class.active]="filter() === 'today'" (click)="filter.set('today')"><span>☀</span> Today <b>{{ todayCount() }}</b></button><button [class.active]="filter() === 'open'" (click)="filter.set('open')"><span>○</span> To do <b>{{ openCount() }}</b></button><button [class.active]="filter() === 'done'" (click)="filter.set('done')"><span>✓</span> Completed <b>{{ doneCount() }}</b></button></nav>
    <div class="sidebar-foot"><p>“Small steps count.”</p><button class="logout" (click)="logout()">Sign out ↗</button></div>
  </aside>
  <section class="workspace">
    <header><div><p class="eyebrow">{{ today | date:'EEEE, MMMM d' }}</p><h1>{{ greeting() }}, {{ displayName() }} <span>✦</span></h1><p class="subhead">{{ openCount() ? 'A few thoughtful things are waiting for you.' : 'Your list is clear. Enjoy the breathing room.' }}</p></div><button class="add-task" (click)="openComposer()">+ <span>New task</span></button></header>
    <div class="progress-note"><div><span>Today’s rhythm</span><strong>{{ doneCount() }} of {{ tasks().length }} tasks complete</strong></div><div class="progress-track"><i [style.width.%]="progress()"></i></div><b>{{ progress() }}%</b></div>
    <section class="list-head"><h2>{{ filterLabel() }}</h2><label class="search"><span>⌕</span><input [(ngModel)]="searchTerm" (ngModelChange)="search.set($event)" placeholder="Search your notes"></label><label class="sort">Sort <select [ngModel]="sortBy()" (ngModelChange)="sortBy.set($event)"><option value="created">Recently added</option><option value="due">Due date</option><option value="priority">Priority</option></select></label><span>{{ visibleTasks().length }} {{ visibleTasks().length === 1 ? 'item' : 'items' }}</span></section>
    <section class="task-list">
      @for (task of visibleTasks(); track task._id) { <article class="task-card" [class.is-done]="task.completed"><button class="check" [class.checked]="task.completed" (click)="toggleTask(task)">{{ task.completed ? '✓' : '' }}</button><div class="task-copy"><div class="task-title-row"><h3>{{ task.title }}</h3><span class="priority" [class]="task.priority">{{ task.priority }}</span></div>@if (task.notes) { <p>{{ task.notes }}</p> }<div class="meta"><span class="category">{{ task.category }}</span>@if (task.dueDate) { <span class="due" [class.overdue]="isOverdue(task)">◷ {{ dueLabel(task) }}</span> }</div></div><button class="more" (click)="edit(task)" aria-label="Edit task">•••</button></article> }
      @if (!visibleTasks().length) { <div class="empty"><div>☁</div><h3>Nothing here yet</h3><p>Make a little room for a new intention.</p><button (click)="openComposer()">Write a task</button></div> }
    </section>
  </section>
  @if (showComposer()) { <div class="modal-backdrop" (click)="closeComposer()"><section class="composer" (click)="$event.stopPropagation()"><button class="close" (click)="closeComposer()">×</button><p class="eyebrow">{{ editing() ? 'EDIT NOTE' : 'A FRESH NOTE' }}</p><h2>{{ editing() ? 'Refine this task' : 'What needs your attention?' }}</h2><form (ngSubmit)="save()"><label>Task<input [(ngModel)]="draft.title" name="title" placeholder="e.g. Send the project update" required autofocus></label><label>A little more context <textarea [(ngModel)]="draft.notes" name="notes" rows="3" placeholder="Add a note, if it helps…"></textarea></label><div class="form-grid"><label>Category<select [(ngModel)]="draft.category" name="category"><option>Personal</option><option>Work</option><option>Study</option><option>Health</option></select></label><label>Due date<input [(ngModel)]="draft.dueDate" name="dueDate" type="date"></label></div><fieldset><legend>Priority</legend>@for (level of priorities; track level) { <button type="button" [class.selected]="draft.priority === level" [class]="level" (click)="draft.priority = level">{{ level }}</button> }</fieldset><div class="composer-actions">@if (editing()) { <button type="button" class="delete" (click)="remove()">Delete task</button> }<button class="primary" [disabled]="saving()">{{ saving() ? 'Saving…' : editing() ? 'Save changes' : 'Add to my list' }}</button></div></form></section></div> }
</main>` })
export class DashboardComponent implements OnInit {
  tasks = signal<Task[]>([]); filter = signal<Filter>('all'); search = signal(''); searchTerm = ''; sortBy = signal<'created' | 'due' | 'priority'>('created'); showComposer = signal(false); editing = signal<Task | null>(null); saving = signal(false); today = new Date(); priorities: TaskDraft['priority'][] = ['low', 'medium', 'high'];
  draft: TaskDraft = this.newDraft();
  visibleTasks = computed(() => {
    const query = this.search().trim().toLowerCase();
    const results = this.tasks().filter(task => {
      const correctState = this.filter() === 'all' || (this.filter() === 'done' ? task.completed : this.filter() === 'today' ? this.isToday(task) : !task.completed);
      return correctState && (!query || `${task.title} ${task.notes} ${task.category}`.toLowerCase().includes(query));
    });
    const priority = { high: 0, medium: 1, low: 2 };
    return [...results].sort((a, b) => this.sortBy() === 'priority' ? priority[a.priority] - priority[b.priority] : this.sortBy() === 'due' ? (a.dueDate || '9999').localeCompare(b.dueDate || '9999') : b.createdAt.localeCompare(a.createdAt));
  });
  openCount = computed(() => this.tasks().filter(t => !t.completed).length); todayCount = computed(() => this.tasks().filter(t => this.isToday(t)).length); doneCount = computed(() => this.tasks().filter(t => t.completed).length); progress = computed(() => this.tasks().length ? Math.round(this.doneCount() / this.tasks().length * 100) : 0);
  constructor(public auth: AuthService, private taskApi: TaskService) {}
  ngOnInit() { this.taskApi.list().subscribe(tasks => this.tasks.set(tasks)); }
  initials() { return this.auth.user()?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(); }
  greeting() { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; }
  displayName() { return this.auth.user()?.name.split(' ')[0] || 'friend'; }
  isOverdue(task: Task) { return !task.completed && !!task.dueDate && new Date(task.dueDate).setHours(23, 59, 59, 999) < Date.now(); }
  isToday(task: Task) { return !!task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString(); }
  dueLabel(task: Task) { const date = new Date(task.dueDate || ''); const today = new Date(); if (date.toDateString() === today.toDateString()) return 'Today'; today.setDate(today.getDate() + 1); if (date.toDateString() === today.toDateString()) return 'Tomorrow'; return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date); }
  filterLabel() { return this.filter() === 'all' ? 'Everything on your page' : this.filter() === 'today' ? 'A gentle focus for today' : this.filter() === 'open' ? 'Things to do' : 'Little wins'; }
  openComposer() { this.editing.set(null); this.draft = this.newDraft(); this.showComposer.set(true); }
  closeComposer() { this.showComposer.set(false); }
  edit(task: Task) { this.editing.set(task); this.draft = { title: task.title, notes: task.notes, category: task.category, priority: task.priority, dueDate: task.dueDate?.slice(0, 10), completed: task.completed }; this.showComposer.set(true); }
  save() { this.saving.set(true); const active = this.editing(); const request = active ? this.taskApi.update(active._id, this.draft) : this.taskApi.create(this.draft); request.subscribe({ next: t => { this.tasks.update(list => active ? list.map(x => x._id === t._id ? t : x) : [t, ...list]); this.closeComposer(); this.saving.set(false); }, error: () => this.saving.set(false) }); }
  toggleTask(task: Task) { this.taskApi.update(task._id, { completed: !task.completed }).subscribe(updated => this.tasks.update(list => list.map(t => t._id === updated._id ? updated : t))); }
  remove() { const task = this.editing(); if (task && confirm('Remove this task from your notebook?')) this.taskApi.delete(task._id).subscribe(() => { this.tasks.update(list => list.filter(t => t._id !== task._id)); this.closeComposer(); }); }
  logout() { this.auth.logout(); location.assign('/login'); }
  private newDraft(): TaskDraft { return { title: '', notes: '', category: 'Personal', priority: 'medium', dueDate: '', completed: false }; }
}
