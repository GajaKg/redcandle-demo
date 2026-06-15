import { HttpErrorResponse, HttpEventType, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { Router } from "@angular/router";
import { SnackBarService } from "@/core/services/snackbar.service";
import { NoToastMessage } from "../constants/http.constants";



export const globalErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const _snackBar = inject(SnackBarService);
  const _router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      // 1. Client-Side or Network Errors
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Client Error: ${error.error.message}`;
      }

      // 2. Server-Side Status Code Errors
      else {
        switch (error.status) {
          case 400:
            errorMessage = 'Neuspešno! Proverite podatke za unos ponovo.';
            break;
          case 401:
            // errorMessage = 'Unauthorized. Redirecting to login...';
            // _router.navigate(['/login']); // Auto-navigate on auth failure
            break;
          case 403:
            errorMessage = 'Zabranjeno. Nemate potrebna prava.';
            break;
          case 404:
            errorMessage = 'Tražena stranica ne postoji.';
            break;
          case 500:
            errorMessage = 'Neuspešno, molimo vas probajte kasnije.';
            break;
          default:
            errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
        }
      }

      if (req.context.get(NoToastMessage) === true) {
        _snackBar.error(errorMessage)
      }
      // Log to console or external monitoring system
      // console.error(errorMessage);

      // CRITICAL: Always rethrow the error so components can listen if needed
      return throwError(() => error);
    })
  );
};

// export const errorInterceptor: HttpInterceptorFn = (req, next) => {
//   const _snackBar = inject(SnackBarService);

//   return next(req).pipe(
//     catchError((res: HttpErrorResponse) => {
//       if (res.type === HttpEventType.Response && res instanceof HttpErrorResponse) {
//         _snackBar.error;
//         // toastService.showError('An error occurred while fetching data!');
//         // diagnostics.logError(res);
//         // return of(res);
//       }
//     })
//   );
// };
