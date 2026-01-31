import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. שליפת ה-Token מהזיכרון של הדפדפן
  const token = localStorage.getItem('token');

  // 2. אם יש Token, נשכפל את הבקשה ונוסיף לה את ה-Header
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // 3. אם אין Token (למשל בלוגין), נשלח את הבקשה המקורית
  return next(req);
};