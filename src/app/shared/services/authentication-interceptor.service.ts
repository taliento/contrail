import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/observable/throw';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthenticationInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let request: HttpRequest<any>;
    const router = this.injector.get(Router);

    if (localStorage && localStorage.getItem('currentUser')) {
      const auth = JSON.parse(localStorage.getItem('currentUser'));

      if (!auth || !auth.token) { return next.handle(req); }// only logged users

      request = req.clone({setHeaders: {Authorization: `Bearer ${auth.token}`}});

    } else {
      request = req.clone();
    }

    return next.handle(request)
    .pipe(
      catchError((error: HttpErrorResponse) => {
       if (error.status === 401) {
         localStorage.clear();

         router.navigate(['/login']); // FIXME
       }

       console.log(error);

       return throwError(error);
     }),
    );
  }

}
