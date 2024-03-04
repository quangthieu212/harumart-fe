import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
// import { ProductInCart } from '../models/ProductInCart';

export const STORAGE_CART = 'carts';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart$: BehaviorSubject<Cart[]> = new BehaviorSubject<Cart[]>([]);

  constructor(
    private storageCtrl: Storage
  ) {
    this.loadProductsInCart();
  }

  async addProductToCart(product: Product) {
    const lastProducts = await this.getProductsIncart();
    if (lastProducts.length === 0) {
      lastProducts.push({ product, quantity: 1 });
      return this.storageCtrl.set(STORAGE_CART, JSON.stringify(lastProducts));
    }
    const existInCarts = lastProducts.find(c => this.compareFn(c.product, product));
    if (!existInCarts) {
      lastProducts.push({ product, quantity: 1 });
    } else {
      existInCarts.quantity = existInCarts.quantity + 1;
    }
    this.cart$.next(lastProducts);
    return this.storageCtrl.set(STORAGE_CART, JSON.stringify(lastProducts));
  }

  async removeProductToCart(product: Partial<Product>) {
    const lastProducts = await this.getProductsIncart();
    const prodIdx = lastProducts.findIndex(c => this.compareFn(c.product, product));
    if (prodIdx > -1) {
      lastProducts.splice(prodIdx, 1);
    }
    this.cart$.next(lastProducts);
    return  this.storageCtrl.set(STORAGE_CART, JSON.stringify(lastProducts));
  }

  async updateProduct(product: Partial<Product>, qty: number) {
    const lastProducts = await this.getProductsIncart();
    const existInCarts = lastProducts.find(c => this.compareFn(c.product, product));
    if (existInCarts) {
      existInCarts.quantity = qty;
      this.cart$.next(lastProducts);
      return this.storageCtrl.set(STORAGE_CART, JSON.stringify(lastProducts));
    }
  }

  async loadProductsInCart() {
    const products = await this.getProductsIncart();
    this.cart$.next(products);
  }

  async getProductsIncart(): Promise<Array<Cart>> {
    const json = await this.storageCtrl.get(STORAGE_CART);
    return JSON.parse(json) || [];
  }

  compareFn(a: Partial<Product>, b: Partial<Product>): boolean {
    return (a.id === b.id);
  }

  async removeCarts() {
    await this.storageCtrl.remove(STORAGE_CART);
    this.cart$.next(null);
  }
}
