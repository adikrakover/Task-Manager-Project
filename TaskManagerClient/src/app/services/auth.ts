import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // אנחנו לוקחים את הכתובת ששמרנו ב-environment
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  // זו פונקציה שתופעל כשהמשתמש ילחץ על "התחבר"
  login(email: string, password: string): Observable<any> {
    // וודאי ששמות השדות (email, password) תואמים בדיוק לתיעוד ה-API
    return this.http.post(`${environment.apiUrl}/auth/login`, { email, password });
  }
  // בתוך AuthService
register(userData: any) {
  return this.http.post(`${this.apiUrl}/auth/register`, userData);
}
  // בתוך ה-class AuthService
checkConnection() {
  // זו קריאה לכתובת הבריאות של השרת
  return this.http.get('http://localhost:3000/health');
}
}