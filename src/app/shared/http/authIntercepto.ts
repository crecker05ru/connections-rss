// export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
//   // Inject the current `AuthService` and use it to get an authentication token:
//   const authToken = inject(AuthService).getAuthToken();
//   // Clone the request to add the authentication header.
//   const newReq = req.clone({headers: {
//     req.headers.append('X-Authentication-Token', authToken),
//   }});
//   return next(newReq);
// }

// export function cachingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
//   if (req.context.get(CACHING_ENABLED)) {
//     // apply caching logic
//     return;
//   } else {
//     // caching has been disabled for this request
//     return next(req);
//   }
// }