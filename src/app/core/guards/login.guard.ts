import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';


const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanLoad {

  constructor(
    private storage: Storage,
    private router: Router) { }

  async canLoad(): Promise<boolean> {
      const token = await this.storage.get(TOKEN_KEY);
      if (token) {
        this.router.navigateByUrl('/home', { replaceUrl:true });
      } else {
        return true;
      }
  }
}
