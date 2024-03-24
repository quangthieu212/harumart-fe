import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MapProduct } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class MapProductsService {

  private mapProducts$: BehaviorSubject<MapProduct[]> = new BehaviorSubject<MapProduct[]>([]);

  constructor() {
    const storedMapProducts = sessionStorage.getItem('mapProducts');
    if (storedMapProducts) {
      this.mapProducts$.next(JSON.parse(storedMapProducts));
    }
  }

  updateMapProducts(products: MapProduct[]): void {
    this.mapProducts$.next(products);
    sessionStorage.setItem('mapProducts', JSON.stringify(products));
  }

  getLastMapProductsValue(): MapProduct[] {
    return this.mapProducts$.getValue();
  }
}
