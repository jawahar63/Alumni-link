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

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem('token');
        authService.isLoggedIn$.next(false);
        router.navigate(['login']);
        socialAuthService.signOut();
        toasterService.addToast('warning', 'Warning!', 'Token expired', 5000);
      }
      return throwError(() => error)
    })
  );
};
