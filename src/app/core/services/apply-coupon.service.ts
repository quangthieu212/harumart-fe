import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplyCouponService {
  private listCoupon$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor() {
  }

  updateCoupons(products: any[]): void {
    this.listCoupon$.next(products);
  }

  getLastCouponsValue(): any[] {
    return this.listCoupon$.getValue();
  }
}
