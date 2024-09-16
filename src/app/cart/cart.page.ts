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
import { Params } from '@angular/router';
import { OrderLineRequest } from '../core/models/Order';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { Storage } from '@ionic/storage-angular';

const PHONE_NUMBER = 'phone-number';

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
  vouchersSaved: any = [];
  vouchersSavedOrigin: any = [];

  constructor(
    private storage: Storage,
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
    this.getVouchers();
  }

  async ionViewWillEnter() {
    this.voucher = null;
    this.voucherCode = null;
    this.promotion = null;
    this.promotionCode = null;
    this.data = await this.cartService.getProductsIncart();
    this.checkSameWarehouse();
    if (this.data.length === 0) {
      this.show = false;
    } else {
      this.show = true;
      this.data.forEach(item => item.note = '');
    }
  }

  async getVouchers() {
    const currentUser = await this.auth.getUser();
    this.couponService.getVoucher(currentUser)
      .subscribe(
        (result: any) => {
          this.vouchersSavedOrigin = result.filter(item => item.isSave) || [];
          this.vouchersSaved = result.filter(item => item.isSave)  || [];
        }
      );
  }

  changeVoucher(event) {
    if (!event) {
      this.voucherCode = null;
      this.voucher = null;
      return;
    }
    this.voucherCode = event.code;
    this.applyVoucher();
  }

  checkSameWarehouse() {
    const warehouseIds = [];
    this.data.forEach(item => {
      if (item.product.categoryOdooId !== 40) {
        warehouseIds.push(item.product.productWarehouseOdoo.warehouseId);
      }
    });
    const uniqueArr = [...new Set(warehouseIds)];
    this.isNotSameWarehouse = uniqueArr.length > 1 ? true : false;
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  avaiableQty(product: Product) {
    if (product.qtyAvailable || product.categoryOdooId === 40) {
      return true;
    }
    return false;
  }

  async getQty(qty, cart: Cart) {
    cart.quantity = qty;
    await this.cartService.updateProduct(cart.product, qty);
    if (this.promotionCode) {
      this.applyPromotion();
    }
    if (this.voucherCode) {
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
          if (this.isDaiLy && j.product.agentDiscountOdoo) {
            res += Number(j.product.agentDiscountOdoo * j.quantity);
          } else if (!this.isDaiLy && j.product.partnerDiscountOdoo) {
            res += Number(j.product.partnerDiscountOdoo * j.quantity);
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

  gotoProudctPromotions() {
    const query: Params = {
      categoryId: 40
    };
    this.fun.navigateWithQuery('/products', {queryParams: query});
  }

  async checkout() {
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
    await this.cartService.updateProductNote(this.data);
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

  async applyPromotion() {
    const phone = await this.storage.get(PHONE_NUMBER);
    const totalItems = this.data.reduce((total, product) => total + product.quantity, 0);
    const saleOrderLine: OrderLineRequest[] = this.data.map(item => {
          const product = item.product;
          const warehouseId = product?.productWarehouseOdoo?.warehouseId;
          if (!warehouseId) {
            this.ionicCoreService.showToastError({message: 'Sản phẩm ' + product.name + ' chưa được cấu hình kho.'});
            return;
          }
          const orderLine: OrderLineRequest = {
            name: product.name,
            priceReduce: 0,
            priceReduceTaxexcl: 0,
            priceReduceTaxinc: 0,
            priceSubtotal: product.finalPrice || product.price,
            priceTax: 0,
            priceTotal: (product.finalPrice || product.price)*item.quantity,
            priceUnit: 0,
            productId: Number(product.odooId),
            productTmplId: product.productTmplId,
            quantity: item.quantity,
            note: item.note,
            product:  {uomId: 1},
            // eslint-disable-next-line @typescript-eslint/naming-convention
            product_uom_qty: 1,
            uom: 1,
            discount: 0,
            partnerDiscountOdoo: product.partnerDiscountOdoo || 0,
            agentDiscountOdoo: product.agentDiscountOdoo || 0,
            partnerPointOdoo: product.partnerPointOdoo,
            agentPointOdoo: product.agentPointOdoo
          };
          return orderLine;
    });

    forkJoin([
      this.couponService.applyPromotion(this.promotionCode, Number(this.calculate(0)), totalItems, saleOrderLine),
      this.couponService.validPromotion(this.promotionCode, phone)
    ]).subscribe(
      ([applyResult, validResult]: [any, any]) => {
        console.log('applyResult', applyResult);
        console.log('validResult', validResult);
        if (applyResult.couponCode && validResult.toUpperCase() === 'SUCCESS') {
          this.promotion = applyResult;
        } else {
          this.promotion = null;
          if (validResult.toUpperCase() !== 'SUCCESS') {
            this.ionicCoreService.showToastError({message: validResult});
          }
        }
      },
      (error: any) => {
        this.promotion = null;
        console.log(error);
      }
    );
  }

  applyVoucher() {
    this.couponService.applyCoupon(this.voucherCode, Number(this.calculate(0))).subscribe(
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
