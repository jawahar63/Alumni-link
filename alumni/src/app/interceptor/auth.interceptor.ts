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

  if (req.url.includes('/login')) {
    return next(req);
  }
  if (req.url.startsWith('/api/auth/login')) {
  return next(req);
}
  const clonedRequest = req.clone();

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem('token');  // Clear token
        authService.isLoggedIn$.next(false);  // Update login status
        router.navigate(['login']);  // Redirect to login page
        socialAuthService.signOut();  // Sign out from social auth service
        toasterService.addToast('warning', 'Warning!', 'Token expired', 5000);  // Show toast notification
      }

      return throwError(() => error);
    })
  );
};

