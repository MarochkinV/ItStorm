import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {catchError, switchMap} from 'rxjs/operators';
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokens = this.authService.getTokens();
    let authReq = req;
    if (tokens?.accessToken && !req.url.includes('login') && !req.url.includes('signup')) {
      authReq = req.clone({
        headers: req.headers.set('x-auth', tokens.accessToken)
      });
    }
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('login') && !req.url.includes('refresh')) {
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refresh().pipe(
      switchMap((result: DefaultResponseType | LoginResponseType) => {
        let error = '';
        if ((result as DefaultResponseType).error !== undefined) {
          error = (result as DefaultResponseType).message;
        }
        const refreshResult = result as LoginResponseType;
        if (!error && refreshResult.accessToken && refreshResult.refreshToken) {
          this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);
          const newAuthReq = req.clone({
            headers: req.headers.set('x-auth', refreshResult.accessToken)
          });
          return next.handle(newAuthReq);
        }
        this.authService.removeTokens();
        this.router.navigate(['/login']);
        return throwError(() => new Error(error || 'Refresh token failed'));
      }),
      catchError((refreshError) => {
        this.authService.removeTokens();
        this.router.navigate(['/login']);
        return throwError(() => refreshError);
      })
    );
  }
}
