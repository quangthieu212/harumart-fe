import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { FunctionsService } from 'src/app/functions.service';
import { UserType } from '../models/User';

const TOKEN_KEY = 'auth-token';
const USER_DETAIL = 'user-detail';
const PHONE_NUMBER = 'phone-number';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: Observable<any>;
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
	// private userData = new BehaviorSubject(null);

  constructor(
    private storage: Storage,
    private http: HttpClient,
    private router: Router,
    private plt: Platform,
    public fun: FunctionsService,
  ) {
    this.loadStoredToken();
  }

  async loadStoredToken() {
		await this.storage.create();
		const platformObs = from(this.plt.ready());

		this.user = platformObs.pipe(
			switchMap(() => from(this.storage.get(TOKEN_KEY))),
			map((token) => {
				if (token) {
					// const decoded = helper.decodeToken(token);
					// this.userData.next(token);
          this.isAuthenticated.next(true);
					return true;
				} else {
          this.isAuthenticated.next(false);
					return null;
				}
			})
		);
	}

  register(body): Observable<any> {
    const headers = new HttpHeaders()
      .append('Accept', '*/*')
      .append('content-type','application/json; charset=utf-8;');
    const options = { headers,withCredentials: true};
    return this.http.post(`${environment.apiUrl}/v1/Users/register`, body, options).pipe(
			take(1),
			map((res: any) => {
        if (res.isSuccess) {
          return res.data;
        }
        return res;
			}),
			switchMap(async (user: any) => {
        const userDetail = {
          username: user.username,
          displayName: user.displayName,
          userId: user.id
        };
        await this.storage.set(PHONE_NUMBER, body.phoneNumber);
				await this.storage.set(USER_DETAIL, userDetail);
				return of(user);
			})
		);
  }

  login(phoneNumber: string, password: string): Observable<any> {
    const headers = new HttpHeaders()
      .append('Accept', '*/*')
      .append('content-type','application/json; charset=utf-8;');
    const options = { headers,withCredentials: true};
    return this.http.post(`${environment.apiUrl}/v1/Users/login`, {phoneNumber, password}, options).pipe(
			take(1),
			map((res: any) => {
        if (res.isSuccess) {
          return res.data;
        }
        return res;
			}),
			switchMap(async (user) => {
				// const decoded = helper.decodeToken(user.accessToken);
				// this.userData.next(user.accessToken);
        await this.storage.set(PHONE_NUMBER, phoneNumber);
        await this.storage.set(USER_DETAIL, user);
				const storageObs = from(this.storage.set(TOKEN_KEY, user.accessToken));
				return storageObs;
			}),
      tap((_) => {
				this.isAuthenticated.next(true);
			})
		);
  }

  delete(): Observable<any> {
    const headers = new HttpHeaders()
      .append('Accept', '*/*')
      .append('content-type','application/json; charset=utf-8;');
    const options = { headers,withCredentials: true};
    return this.http.post(`${environment.apiUrl}/v1/Users/delete`, {}, options).pipe(
			take(1),
			map((res: any) => {
        if (res.isSuccess) {
          return res.data;
        }
        return res;
			}),
			switchMap(async (user) => {
				await this.storage.remove(USER_DETAIL);
        await this.storage.remove(TOKEN_KEY);
        await this.storage.remove(PHONE_NUMBER);
        await this.storage.remove('carts');
			})
		);
  }

  async getUser() {
		return await this.storage.get(USER_DETAIL);
	}

  async getPhoneNumber() {
		return await this.storage.get(PHONE_NUMBER);
	}

  async setPhoneNumber(phone: string) {
		return await this.storage.set(PHONE_NUMBER, phone);
	}

  async getToken() {
		return await this.storage.get(TOKEN_KEY);
	}

  async isLogin(): Promise<boolean> {
		const user =  await this.storage.get(USER_DETAIL);
    return user?.accessToken ? true : false;
	}

  async isDaiLy(): Promise<boolean> {
		const user =  await this.storage.get(USER_DETAIL);
    return user?.type === UserType.DAI_LY ? true : false;
	}

  getUserByUserName() {
    return this.http.get(`${environment.apiUrl}/User`, {});
  }

  async logout() {
    this.isAuthenticated.next(false);
    await this.storage.remove(USER_DETAIL);
    await this.storage.remove(TOKEN_KEY);
    await this.storage.remove(PHONE_NUMBER);
    await this.storage.remove('carts');
    this.fun.navigate('/login');
    // this.userData.next(null);
	}
}
