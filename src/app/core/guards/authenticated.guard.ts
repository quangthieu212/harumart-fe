import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivateChild,
} from '@angular/router';
import { from, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage-angular';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private navCtrl: NavController,
    private storage: Storage
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const promiseSource = from(this.storage.get(TOKEN_KEY));
    return promiseSource.pipe(
      take(1),
      map((user) => {
        if (!user) {
          this.navCtrl.navigateRoot('/login');
          return false;
        } else {
          return true;
        }
      })
    );
  }
  // canActivateChild(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return false;
  // }
}
