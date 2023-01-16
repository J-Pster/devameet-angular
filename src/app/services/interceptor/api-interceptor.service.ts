import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiInterceptorService implements HttpInterceptor {
  private requestsQueue: number = 0;

  constructor() {} // We can implement an loader service here

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.requestsQueue++;
    // We can implement an loader service here

    const token = localStorage.getItem('@devameet:token');
    if (!token) return next.handle(req);

    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    return next.handle(authReq).pipe(
      finalize(() => {
        this.requestsQueue--;
        // We can implement an loader service here
      })
    );
  }
}
