import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  // נסי לשנות את זה לכתובת הפרויקטים הישירה
  private apiUrl = `${environment.apiUrl}/projects`; 

  constructor(private http: HttpClient) {}

  // שליפה לפי query parameter (לפעמים השרת מעדיף כך)
  getProjectsByTeam(teamId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?teamId=${teamId}`);
  }

  // יצירה עם ה-teamId בתוך גוף ההודעה
  createProject(teamId: string, name: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { 
      name: name, 
      teamId: teamId // השרת מצפה לדעת לאיזה צוות לשייך
    });
  }
// עדכון שם פרויקט (PATCH) - מותאם לראוטר של השרת שלך
updateProject(projectId: string, name: string): Observable<any> {
  return this.http.patch(`${this.apiUrl}/${projectId}`, { name });
}

// מחיקת פרויקט
deleteProject(projectId: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${projectId}`);
}
}