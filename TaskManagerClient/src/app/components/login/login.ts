import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // הוספת Reactive Forms
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BidiModule } from '@angular/cdk/bidi';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, // שימוש ב-ReactiveFormsModule במקום FormsModule
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    BidiModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // הגדרת קבוצת הטופס
  hide = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder, // הזרקת FormBuilder ליצירת הבדיקות
    private authService: AuthService, 
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // הגדרת חוקי התקינות
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email // מוודא שזה פורמט אימייל (עם @ ונקודה)
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6) // סיסמה חייבת להיות לפחות 6 תווים
      ]]
    });
  }

  onLogin() {
    // אם הטופס לא תקין, אנחנו מפעילים את כל השגיאות ומראים פופאפ
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // גורם לכל הודעות ה-mat-error להופיע באדום
  
      // בדיקה ספציפית מה חסר כדי להציג פופאפ מדויק
      let errorMessage = 'נא לתקן את השגיאות בטופס:';
      if (this.loginForm.get('email')?.invalid) errorMessage = 'כתובת האימייל אינה תקינה';
      else if (this.loginForm.get('password')?.invalid) errorMessage = 'הסיסמה חייבת להכיל לפחות 6 תווים';
  
      this.showMessage(errorMessage);
      return;
    }
  
    // אם הכל תקין - ממשיכים להתחברות
    const { email, password } = this.loginForm.value;
    this.isLoading = true;
    
    this.authService.login(email, password).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.token) {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/teams']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.showMessage('פרטי התחברות שגויים, נא לנסות שוב');
      }
    });
  }
  private showMessage(msg: string) {
    this.snackBar.open(msg, 'הבנתי', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      direction: 'rtl'
    });
  }
}