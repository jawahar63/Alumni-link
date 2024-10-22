import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../servies/auth.service';
import { Router } from '@angular/router';
import { ToasterService } from '../servies/toaster.service';
import { inject } from '@angular/core';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toasterService = inject(ToasterService);
  const socialAuthService = inject(SocialAuthService);
  if (req.url.includes('/login') || req.url.startsWith('/api/auth/login')) {
    return next(req);
  }
  const token = localStorage.getItem('token');

  let clonedRequest = req;
  if (token) {
    clonedRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        toasterService.addToast('warning', 'Warning!', 'Token expired or invalid. Please log in again.', 5000);
        
        socialAuthService.signOut();
        localStorage.removeItem('token');
        authService.isLoggedIn$.next(false);
        
        router.navigate(['login']);
      }

      return throwError(() => error);
    })
  );
};

