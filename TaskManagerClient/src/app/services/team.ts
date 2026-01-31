import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = `${environment.apiUrl}/teams`;

  constructor(private http: HttpClient) {}

  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // שים לב: ודאי שהנתיב הזה קיים בשרת שלך (בדרך כלל תחת /users ולא /teams)
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/users`); 
  }

  createTeam(name: string): Observable<any> {
    return this.http.post(this.apiUrl, { name });
  }

  deleteTeam(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addMemberToTeam(teamId: string, userId: string): Observable<any> {
    // שליחת ה-userId ב-Body כפי שהשרת מצפה ב-POST
    return this.http.post(`${this.apiUrl}/${teamId}/members`, { userId });
  }

  removeMemberFromTeam(teamId: string, userId: string): Observable<any> {
    // תואם לנתיב: DELETE /:teamId/members/:userId
    return this.http.delete(`${this.apiUrl}/${teamId}/members/${userId}`);
  }

  listTeamMembers(teamId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${teamId}/members`);
  }
}