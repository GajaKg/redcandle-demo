import { ApplicationConfig, ErrorHandler, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from '@/core/interceptors/api.interceptor';
import { GlobalErrorHandler } from './core/services/global-error-handler.service';
import { globalErrorInterceptor } from './core/interceptors/global-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    provideHttpClient(
      withInterceptors([apiInterceptor, globalErrorInterceptor])
    ),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // importProvidersFrom(
    //   StoreModule.forRoot({}),
    //   StoreModule.forFeature('product', productsReducer),
    // )
  ],
};
