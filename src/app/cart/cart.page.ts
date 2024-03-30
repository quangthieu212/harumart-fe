import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { FunctionsService } from '../functions.service';
import { InfomodalPage } from '../infomodal/infomodal.page';
import { ModalController, IonList, NavController, MenuController, AlertController } from '@ionic/angular';
import { CartService } from '../core/services/cart.service';
import { Cart } from '../core/models/Cart';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Product } from '../core/models/Product';
import { AuthService } from '../core/services/auth.service';
import { environment } from '../../environments/environment';
import {CouponService} from '../core/services/coupon.service';
import { ApplyCouponService } from '../core/services/apply-coupon.service';
import { IonicCoreService } from '../core/services/ionic-core.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  @ViewChild('slidingList') slidingList: IonList;

  imageUrl = environment.imageUrl;

  customAlertOptions: any = {
    header: 'Select Quantity',
    translucent: true
  };

  qty = [];
  voucherCode = '';
  promotionCode = '';
  voucher: any;
  promotion: any;
  show = true;
  data: Array<Cart> = [];
  isNotSameWarehouse = false;

  form: FormGroup;
  inventoryQuantity = 1;

  isDaiLy = false;

  constructor(
    private menuCtrl: MenuController,
    // public dataService: DataService,
    public fun: FunctionsService,
    private modalController: ModalController,
    // private nav: NavController,
    public alertController: AlertController,
    private cartService: CartService,
    public sanitizer: DomSanitizer,
    private auth: AuthService,
    private couponService: CouponService,
    private applyCouponService: ApplyCouponService,
    private ionicCoreService: IonicCoreService,
    ) {
    // this.data = dataService.cart;
    // if (this.data.length === 0) { this.show = false; }
    // for (let i = 1; i <= 36; i++) { this.qty.push(i); }
  }

  async ngOnInit() {
    // this.data = await this.cartService.getProductsIncart();
    // if (this.data.length === 0) { this.show = false; }
    this.isDaiLy = await this.auth.isDaiLy();
  }

  async ionViewWillEnter() {
    this.data = await this.cartService.getProductsIncart();
    this.checkSameWarehouse();
    if (this.data.length === 0) {
      this.show = false;
    } else {
      this.show = true;
    }
  }

  checkSameWarehouse() {
    const warehouseIds = [];
    this.data.forEach(item => {
      warehouseIds.push(item.product.productWarehouseOdoo.warehouseId);
    });
    const uniqueArr = [...new Set(warehouseIds)];
    this.isNotSameWarehouse = uniqueArr.length > 1 ? true : false;
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  avaiableQty(product: Product) {
    if (product.qtyAvailable) {
      return true;
    }
    return false;
  }

  async getQty(qty, cart: Cart) {
    cart.quantity = qty;
    await this.cartService.updateProduct(cart.product, qty);
    if (this.promotion) {
      this.applyPromotion();
    }
    if (this.voucher) {
      this.applyVoucher();
    }
  }

  // async open_modal(b) {
  //   let modal;
  //   if (b) {
  //     modal = await this.modalController.create({
  //       component: InfomodalPage,
  //       componentProps: { value: this.dataService.terms_of_use, title: 'Terms of Use' }
  //     });
  //   } else {
  //     modal = await this.modalController.create({
  //       component: InfomodalPage,
  //       componentProps: { value: this.dataService.privacy_policy, title: 'Privacy Policy' }
  //     });
  //   }
  //   return await modal.present();
  // }

  calculate(i) {
    let res = 0;
    if (i === 0) {
      for (const j of this.data) {
        res += (j.product.finalPrice || j.product.price) * j.quantity;
      }
    }

    if (i === 1) {
      for (const j of this.data) {
        if (j.product) {
          if (this.isDaiLy && j.product.partnerDiscountOdoo) {
            res += Number(j.product.partnerDiscountOdoo * j.quantity);
          } else if (!this.isDaiLy && j.product.agentDiscountOdoo) {
            res += Number(j.product.agentDiscountOdoo * j.quantity);
          }
        }
      }
    }
    return res;
  }

  calculateFinalAmount() {
    const promotionFree = this.promotion ? this.promotion.couponFee : 0;
    const couponFree = this.voucher ? this.voucher.couponFee : 0;

    return Number(this.calculate(0) - couponFree - promotionFree);
  }

  calculateFinalDiscount() {
    const promotionFree = this.promotion ? this.promotion.couponFee : 0;
    const couponFree = this.voucher ? this.voucher.couponFee : 0;

    return Number(this.calculate(1) + couponFree + promotionFree);
  }


  fix(a) {
    return a.toFixed(0);
  }

  add() {
    return this.calculateFinalAmount();
  }

  browse() {
    this.fun.navigate('/home', false);
  }

  checkout() {
    if (this.isNotSameWarehouse) {
      this.ionicCoreService.showToastError({message: 'Các sản phẩm trong giỏ hàng phải cùng một kho'});
      return;
    }
    const coupons = [];
    if (this.promotion) {
      coupons.push(this.promotion);
    }
    if (this.voucher) {
      coupons.push(this.voucher);
    }
    this.applyCouponService.updateCoupons(coupons);
    this.fun.checkout();
  }

  async remove(item: Cart, j) {
    const message = `Bạn chắc chắn muốn xoá sản phẩm ${item.product.name} khỏi giỏ?`;
    this.fun.removeConform(message).then(async (res) => {
      console.log('res conform', res);
      if (res === 'ok') {
        if (this.slidingList) {
          this.slidingList.closeSlidingItems();
        }
        this.data.splice(j, 1);
        await this.cartService.removeProductToCart(item.product);
        this.checkSameWarehouse();
        if (this.data.length === 0) {
          this.show = false;
        } else {
          this.show = true;
        }
      }
    });
  }

  applyPromotion() {
    const totalItems = this.data.reduce((total, product) => total + product.quantity, 0);
    this.couponService.applyPromotion(this.promotionCode, Number(this.calculate(0) - this.calculate(1)), totalItems).subscribe(
      (result: any) => {
        if (result.couponCode) {
          this.promotion = result;
        } else {
          this.promotion = null;
        }
      },
      (error: any) => {
        this.voucher = null;
        console.log(error);
      }
    );
  }

  applyVoucher() {
    this.couponService.applyCoupon(this.voucherCode, Number(this.calculate(0) - this.calculate(1))).subscribe(
      (result: any) => {
        if (result.couponCode) {
          this.voucher = result;
        } else {
          this.voucher = null;
        }
      },
      (error: any) => {
        this.voucher = null;
        console.log(error);
      }
    );
  }
}
