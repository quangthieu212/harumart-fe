/* eslint-disable quote-props */
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {
  Router
} from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { IonicCoreService } from '../services/ionic-core.service';
import { FunctionsService } from 'src/app/functions.service';
import { AuthService } from '../services/auth.service';

const TOKEN_KEY = 'auth-token';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
        private storage: Storage,
        private ionicCoreService: IonicCoreService,
        public fun: FunctionsService,
        private authService: AuthService
    ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // const tokenPro = this.storage.get(TOKEN_KEY);
    const promiseSource = from(this.storage.get(TOKEN_KEY));
    return promiseSource.pipe(
      mergeMap(token => {
        if (token) {
          request = request.clone({
            setHeaders: {
              // eslint-disable-next-line quote-props
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'Authorization': 'Bearer ' + token
            }
          });
        }
        if (!request.headers.has('Content-Type')) {
          request = request.clone({
            setHeaders: {
              'content-type': 'application/json'
            }
          });
        }
        request = request.clone({
          headers: request.headers.set('Accept', 'application/json')
        });
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              if (error.error && error.error.success === false) {
                this.ionicCoreService.showToastError({message: 'Phiên đăng nhập đã hết hạn. Bạn vui lòng đăng nhập lại.'});
              } else {
                this.authService.logout();
                return;
              }
            }
            return throwError(error);
          })
        );
      })
    );
  }

}
