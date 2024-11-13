import { ApplicationConfig, Injectable } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {} from 'dotenv/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { authInterceptor } from './interceptor/auth.interceptor';
import { environment } from '../../src/environments/environment.development';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.google_api,{
                oneTapEnabled:false,
                prompt:'consent'
              }
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }, provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync()
  ]
};
