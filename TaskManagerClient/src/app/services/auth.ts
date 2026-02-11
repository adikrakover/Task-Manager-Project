import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  checkConnection() {
    // השתמשי במשתנה הגלובלי ולא ב-localhost
    return this.http.get(`${this.apiUrl}/health`);
  }
}