import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private apiUrl = `${environment.apiUrl}/comments`;

  constructor(private http: HttpClient) {}

  // שליפת תגובות לפי מזהה משימה
  getCommentsByTask(taskId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?taskId=${taskId}`);
  }

  // הוספת תגובה חדשה
// comment.service.ts

// comment.service.ts

addComment(taskId: string, text: string): Observable<any> {
    // השרת מצפה לשדה בשם 'body' ולא 'text'
    const payload = { 
      taskId: taskId, 
      body: text 
    };
    
    return this.http.post(this.apiUrl, payload);
  }
   }