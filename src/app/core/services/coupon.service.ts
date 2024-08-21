import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { format } from 'date-fns';
import { OrderLineRequest } from '../models/Order';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(
    private http: HttpClient,
  ) { }

  getVoucher(user: any) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('userName', user.userName);
    return this.http.get(`${environment.apiUrl}/v1/Orders/get-vouchers`, {params: httpParams});
  }

  getCoupons(user: any) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('userName', user.odooUserId);
    return this.http.get(`${environment.apiUrl}/v1/Orders/get-user-coupon`, {params: httpParams});
  }

  getPromotions() {
    let httpParams = new HttpParams();
    const dateTime = format(new Date(), 'yyyy-MM-dd HH:mm');
    httpParams = httpParams.append('from', dateTime);
    httpParams = httpParams.append('to', dateTime);
    return this.http.get(`${environment.apiUrl}/v1/Orders/get-promotion`, {params: httpParams});
  }

  saveCoupon(couponId: number, user: any) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('couponId', couponId);
    httpParams = httpParams.append('userId', user.odooUserId);
    return this.http.post(`${environment.apiUrl}/v1/Orders/save-coupons`, null,{params: httpParams});
  }

  applyCoupon(code: string, amount: number)  {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('code', code);
    httpParams = httpParams.append('amount', amount);
    return this.http.post(`${environment.apiUrl}/v1/Orders/apply-coupon`, null,{params: httpParams});
  }

  applyPromotion(code: string, amount: number, numberItems: number, saleOrderLine: OrderLineRequest[])  {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('code', code);
    httpParams = httpParams.append('amount', amount);
    httpParams = httpParams.append('num_order_item', numberItems);
    return this.http.post(`${environment.apiUrl}/v1/Orders/apply-promotion`, saleOrderLine, {params: httpParams});
  }
}
