import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../services/comment';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // ייבוא ה-SnackBar

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule,
    MatSnackBarModule // הוספה ל-Imports
  ],
  templateUrl: './comment-section.html',
  styleUrl: './comment-section.css'
})
export class CommentSectionComponent implements OnInit {
  @Input({ required: true }) taskId!: string;
  comments = signal<any[]>([]);
  newCommentText = '';

  constructor(
    private commentService: CommentService,
    private snackBar: MatSnackBar // הזרקת ה-SnackBar
  ) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.commentService.getCommentsByTask(this.taskId).subscribe({
      next: (data) => this.comments.set(data),
      error: () => this.showNotification('שגיאה בטעינת התגובות')
    });
  }

  sendComment() {
    if (!this.newCommentText.trim()) return;
    
    this.commentService.addComment(this.taskId, this.newCommentText).subscribe({
      next: () => {
        this.newCommentText = '';
        this.loadComments();
        this.showNotification('התגובה נוספה בהצלחה!');
      },
      error: (err) => {
        const errorMsg = err.error?.error || 'שגיאה כללית';
        this.showNotification('לא ניתן להוסיף תגובה: ' + errorMsg);
      }
    });
  }

  // פונקציית עזר להצגת הודעות קופצות
  private showNotification(message: string) {
    this.snackBar.open(message, 'סגור', {
      duration: 3000, // יוצג ל-3 שניות
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      direction: 'rtl' // חשוב מאוד לעברית!
    });
  }
}