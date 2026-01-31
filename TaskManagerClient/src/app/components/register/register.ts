import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

// ייבוא רכיבי Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BidiModule } from '@angular/cdk/bidi';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, // שינוי ל-Reactive
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    BidiModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  hide = true; // לצפייה בסיסמה

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.showNotification('נא למלא את כל השדות בצורה תקינה');
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: (res: any) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/teams']);
          this.showNotification('נרשמת בהצלחה!');
        }
      },
      error: (err) => {
        const msg = err.error?.message || 'שגיאה בתהליך ההרשמה. נסה שוב.';
        this.showNotification(msg);
      }
    });
  }

  private showNotification(msg: string) {
    this.snackBar.open(msg, 'הבנתי', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      direction: 'rtl'
    });
  }
}