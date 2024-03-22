import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(
    private http: HttpClient
  ) { }

  getVoucher(user: any) {
    console.log(user);
    let httpParams = new HttpParams();
    httpParams = httpParams.append('userName', user.userName);
    return this.http.get(`${environment.apiUrl}/v1/Orders/get-vouchers`, {params: httpParams});
  }
}
