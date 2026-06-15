import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = 'http://localhost:5036/api'; // Replace with your backend URL

  // Clone the request and prepend the base URL
  const apiReq = req.clone({ url: `${baseUrl}${req.url}` });

  return next(apiReq);
};
