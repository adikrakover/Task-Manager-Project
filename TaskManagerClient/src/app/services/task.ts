import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  // קבלת משימות לפי פרויקט
  getTasksByProject(projectId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?projectId=${projectId}`);
  }

  // יצירת משימה
  createTask(projectId: string, title: string): Observable<any> {
    return this.http.post(this.apiUrl, { title, projectId, completed: false });
  }

  updateTask(taskId: any, completedStatus: boolean): Observable<any> {
    const id = String(taskId);
    
    // אנחנו שולחים אובייקט עם כמה שמות אפשריים לשדה. 
    // שרתים מסוג partial update פשוט מתעלמים משדות שהם לא מכירים ולוקחים את מה שמתאים.
    const body = { 

      status: completedStatus ? 'completed' : 'pending' // אופציה 3
    };
  
    return this.http.patch(`${this.apiUrl}/${id}`, body);
  }
  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${taskId}`);
  }
}