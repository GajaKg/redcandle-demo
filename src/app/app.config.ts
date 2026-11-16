import { ApplicationConfig, ErrorHandler, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { apiInterceptor } from '@/core/interceptors/api.interceptor';
import { GlobalErrorHandler } from './core/services/global-error-handler.service';
import { globalErrorInterceptor } from './core/interceptors/global-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideStore(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    provideHttpClient(withXhr(),
      withInterceptors([apiInterceptor, globalErrorInterceptor])
    ),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // importProvidersFrom(
    //   StoreModule.forRoot({}),
    //   StoreModule.forFeature('product', productsReducer),
    // )
  ],
};
