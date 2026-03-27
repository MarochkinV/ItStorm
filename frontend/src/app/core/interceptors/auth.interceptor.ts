import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    const tokens = this.authService.getTokens();
    let authReq = req;

    if (tokens?.accessToken && !req.url.includes('login') && !req.url.includes('signup')) {
      authReq = req.clone({
        headers: req.headers.set('x-auth', tokens.accessToken)
      });
    }


    return next.handle(authReq);
  }
}
