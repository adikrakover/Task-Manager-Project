import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material Imports
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

// ייבוא הקומפוננטה החדשה של התגובות
import { CommentSectionComponent } from '../comment-section/comment-section';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CommentSectionComponent // הוספה כאן
  ],
  templateUrl: './task-item.html',
  styleUrls: ['./task-item.css']
})
export class TaskItemComponent {
  @Input({ required: true }) task: any;
  @Output() delete = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<any>();

  // Signal לניהול מצב התצוגה של אזור התגובות
  showComments = signal(false);

  /**
   * מחיקת משימה - פליטת אירוע לאבא (TasksComponent)
   */
  onDelete() {
    this.delete.emit(this.task.id);
  }

  /**
   * שינוי סטטוס משימה - פליטת אירוע לאבא (TasksComponent)
   */
  onToggle() {
    this.toggle.emit(this.task);
  }

  /**
   * החלפת מצב הצגת התגובות (פתוח/סגור)
   */
  toggleComments() {
    this.showComments.update(current => !current);
  }
}