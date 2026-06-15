import { ErrorHandler, Injectable } from "@angular/core";

// @Injectable({
//   providedIn: 'root'
// })
export class GlobalErrorHandler implements ErrorHandler {
  // this method will receive the error from anywhere in our app and handle it
  handleError(error: unknown): void {
    // log the error
    console.error('An error occurred (error from GlobalErrorHandler):', error);

    // perform other error-handling operations, like showing toast messages,
    // sending the error to analytics, and so on

  }
}
