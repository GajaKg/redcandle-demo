import { ApplicationConfig, provideExperimentalZonelessChangeDetection, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from '@/core/interceptors/api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideZoneChangeDetection({ eventCoalescing: true }),
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    provideHttpClient(
      withInterceptors([apiInterceptor]) // Register it here
    )
    // importProvidersFrom(
    //   StoreModule.forRoot({}),
    //   StoreModule.forFeature('product', productsReducer),
    // )
  ],
};
