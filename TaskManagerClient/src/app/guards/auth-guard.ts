import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); // בדיקה אם יש טוקן

  if (token) {
    return true; // מאשר כניסה
  } else {
    router.navigate(['/login']); // שולח ללוגין
    return false;
  }
};