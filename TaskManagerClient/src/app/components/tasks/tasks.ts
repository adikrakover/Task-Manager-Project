import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task';
import { FormsModule } from '@angular/forms';
import { TaskItemComponent } from '../task-item/task-item';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BidiModule } from '@angular/cdk/bidi';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TaskItemComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    BidiModule
  ],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css']
})
export class TasksComponent implements OnInit {
  projectId: string = '';
  tasks = signal<any[]>([]);
  newTaskTitle: string = '';

  constructor(private route: ActivatedRoute, private taskService: TaskService) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId') || '';
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasksByProject(this.projectId).subscribe(data => this.tasks.set(data));
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;
    this.taskService.createTask(this.projectId, this.newTaskTitle).subscribe(newTask => {
      this.tasks.update(all => [...all, newTask]);
      this.newTaskTitle = '';
    });
  }

  toggleTask(task: any) {
    const newStatus = !task.completed;
    this.taskService.updateTask(task.id, newStatus).subscribe({
      next: () => {
        this.tasks.update(all => all.map(t => t.id === task.id ? { ...t, completed: newStatus } : t));
      },
      error: (err) => console.error('Server error:', err.error)
    });
  }

  removeTask(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.tasks.update(all => all.filter(t => t.id !== taskId));
    });
  }
}