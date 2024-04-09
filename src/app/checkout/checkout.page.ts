/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { DataService, Address } from '../data.service';
import { AlertController, IonRadioGroup, MenuController, ModalController } from '@ionic/angular';
import { ProvinceSearchPage } from '../core/modals/province-search/province-search.page';
import { DistrictsSearchPage } from '../core/modals/districts-search/districts-search.page';
import { WardsSearchPage } from '../core/modals/wards-search/wards-search.page';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isString, isEmpty} from 'lodash';
import { phoneNumberValidator } from '../core/validators';
import { AddressFormValidators } from '../core/components/address-form/address-form.component';
import { CustomerService } from '../core/services/customer.service';
import { OrderService } from '../core/services/order.service';
import { Customer, PartnerRequest } from '../core/models/Customer';
import { CartService } from '../core/services/cart.service';
import { OrderLineRequest, OrderRequest } from '../core/models/Order';
import { AuthService } from '../core/services/auth.service';
import { IonicCoreService } from '../core/services/ionic-core.service';
import { PaymentService } from '../core/services/payment.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, throttleTime } from 'rxjs/operators';
import { ApplyCouponService } from '../core/services/apply-coupon.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit, OnDestroy {

  @ViewChild('radioGroup') radioGroup: IonRadioGroup;

  form: FormGroup;
  isLoading = false;

  ngUnsubscribe = new Subject();
  paymentAcquirers: any[] = [];
  paymentAcquirerId;
  selectedRadioGroup: any;
  addNewPayment = false;

  isShowReference = false;
  reference = '';

  pageSize = 10;
  pageNumber = 1;
  maxPage = 0;

  searchValue = '';
  searchDecouncer$: Subject<string> = new Subject();

  filterCustomer = {
    pageSize: this.pageSize,
    pageNumber: this.pageNumber,
    searchValue: ''
  };
  customers: Array<Customer> = [];
  customer: Customer;
  customerName: string;
  customerPhone: string;
  payDiscountType = null;
  payShipType = null;
  shipType = null;
  shipPartner = null;
  shipFee = 0;
  shipObject: any;

  constructor(
    private menuCtrl: MenuController,
    public fun: FunctionsService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private customerService: CustomerService,
    private orderService: OrderService,
    private cartService: CartService,
    private auth: AuthService,
    private ionicCoreService: IonicCoreService,
    private paymentService: PaymentService,
    private applyCouponService: ApplyCouponService
    ) {
      this.setupSearchDebouncer();
     }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  ngOnInit() {
    this.initForm();
    this.form.get('shippingAddress').valueChanges.pipe(
      throttleTime(3000 )
    )
    .subscribe(async (value) => {
      if (value.ward && value.ward.id) {
        this.getShippingFee(value);
      }
    });
    this.paymentService.getPaymentAcquirers().pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any) => {
      if (res.isSuccess) {
        for (const item of res.data) {
          if (item.provider === 'COD') {
            this.paymentAcquirerId = '' + item.id;
            this.paymentAcquirers.push({...item, checked: true, color: 'primary'});
          } else {
            this.paymentAcquirers.push({...item, checked: false, color: 'secondary'});
          }
        }
      }
    });
  }

  searchCustomers() {
    this.isLoading = true;
    this.filterCustomer.searchValue = this.searchValue;
    this.customerService.searchCustomer(this.filterCustomer)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: any) => {
        if (result && result.isSuccess) {
          this.customers = result.data;
          const totalRecords = result.totalRecords;
          this.maxPage = this.round(totalRecords/this.pageSize, 0);
        }
        this.isLoading = false;
    },
    (e) => {
      this.isLoading = false;
    });
  }

  search(event) {
    this.searchDecouncer$.next(event.target.value);
  }

  changeCustomer(event) {
    this.customer = event;
    this.customerName = this.customer.displayName;
    this.customerPhone = this.customer.phone;
  }

  round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  setupSearchDebouncer(): void {
    this.searchDecouncer$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((searchValue: string) => {
      this.searchValue = searchValue;
      this.searchCustomers();
    });
  }

  initForm() {
    this.form = this.fb.group({
      shippingAddress: this.fb.control('', [AddressFormValidators(['province', 'district', 'ward']).required])
    });
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  async onClickSelectProvince() {
    const modal = await this.modalCtrl.create({
        component: ProvinceSearchPage,
        mode: 'ios'
    });
    modal.present();
    modal.onWillDismiss().then(data => {
        const province = data.data;
        if (province) {
            this.form.get('district').reset();
            this.form.get('ward').reset();
            this.form.get('province').patchValue(province);
        }
    });
}

async onClickSelectDistrict() {
    const hasProvince = this.form.get('province.id').valid;
    if (!hasProvince) {
        return;
    }
    const provinceId = this.form.get('province').get('id').value;
    const modal = await this.modalCtrl.create({
        component: DistrictsSearchPage,
        mode: 'ios',
        componentProps: {
            provinceId
        }
    });
    modal.present();
    modal.onWillDismiss().then(data => {
        console.log('onClickSelectDistrict', data);
        const district = data.data;
        if (district) {
            this.form.get('ward').reset();
            this.form.get('district').patchValue(district);
        }
    });
}

async onClickWard() {
    const hasDistrict = this.form.get('district.id').valid;
    if (!hasDistrict) {
        return;
    }
    const districtId = this.form.get('district').get('id').value;
    const modal = await this.modalCtrl.create({
        component: WardsSearchPage,
        mode: 'ios',
        componentProps: {
            districtId
        }
    });
    modal.present();
    modal.onWillDismiss().then(data => {
        console.log('onClickWard', data);
        const ward = data.data;
        if (ward) {
            this.form.get('ward').patchValue(ward);
        }
    });
}

  async done() {
    if (this.form.invalid) {
      return;
    }
    if (!this.shipPartner || !this.shipType) {
      this.ionicCoreService.showToastError({message: 'Vui lòng chọn đơn vị vận chuyển'});
      return;
    }
    if (this.form.valid) {
      this.isLoading = true;
      const carts = await this.cartService.getProductsIncart();
      if (carts.length === 0) {
        this.isLoading = false;
        return;
      }
      if (!this.customerName || !this.customerPhone) {
        this.ionicCoreService.showToastError({message: 'Bạn phải chọn khách hàng hoặc nhập thông tin nhận hàng.'});
        this.isLoading = false;
        return;
      }
      if (!this.paymentAcquirerId) {
        this.ionicCoreService.showToastError({message: 'Bạn phải chọn một phương thức thanh toán.'});
        this.isLoading = false;
        return;
      }
      const formValue = this.form.value;
      const partnerRequest: PartnerRequest = {
        name: this.customerName,
        phone: this.customerPhone,
        street: `${formValue.shippingAddress.province.name}, ${formValue.shippingAddress.district.name}, ${formValue.shippingAddress.ward.name}`,
        street2: formValue.shippingAddress.street2,
        stateId: 1,
        countryId: 1,
        isCompany: false,
        isDefault: true,
        ship_partner: this.shipPartner,
        ship_type: this.shipType === 'fast' ? true : false,
      };
      const productMap = new Map<number, Array<OrderLineRequest>>();
        for (const cart of carts) {
          const product = cart.product;
          const warehouseId = product?.productWarehouseOdoo?.warehouseId;
          if (!warehouseId) {
            this.ionicCoreService.showToastError({message: 'Sản phẩm ' + product.name + ' chưa được cấu hình kho.'});
            this.isLoading = false;
            return;
          }
          const orderLine: OrderLineRequest = {
            name: product.name,
            priceReduce: 0,
            priceReduceTaxexcl: 0,
            priceReduceTaxinc: 0,
            priceSubtotal: product.finalPrice || product.price,
            priceTax: 0,
            priceTotal: (product.finalPrice || product.price)*cart.quantity,
            priceUnit: 0,
            productId: Number(product.odooId),
            productTmplId: product.productTmplId,
            quantity: cart.quantity,
            note: cart.note,
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
          // amountTotal += product.finalPrice*cart.quantity;
          if (productMap.get(warehouseId) && productMap.get(warehouseId).length > 0) {
            productMap.get(warehouseId).push(orderLine);
          } else {
            const orderLines: Array<OrderLineRequest> = [];
            orderLines.push(orderLine);
            productMap.set(warehouseId, orderLines);
          }
        }
        const user = await this.auth.getUser();
        const orderRequests: Array<OrderRequest> = [];
        for (const warehouseIdKey of productMap.keys()) {
          const orderLines = productMap.get(warehouseIdKey);
          let amountTotal = orderLines.map(o => o.priceTotal).reduce((p1, p2) => p1 + p2, 0);
          const couponsApplied = this.applyCouponService.getLastCouponsValue();
          if (couponsApplied && couponsApplied.length) {
            couponsApplied.forEach((coupon) => {
              amountTotal = Number(amountTotal - coupon.couponFee);
            });
          }
          let orderRequest: OrderRequest = {
            amountTax: 0,
            amountUntaxed: 0,
            amountTotal,
            createDate: new Date(),
            dateOrder: new Date(),
            state: 'NEW',
            saleOrderLine: orderLines,
            requirePayment: true,
            requireSignature: true,
            userId: user ? user.odooUserId : null,
            warehouseId: warehouseIdKey
          };
          if (couponsApplied && couponsApplied.length) {
            orderRequest = {
              ...orderRequest,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              ApplyCoupon: this.applyCouponService.getLastCouponsValue()
            };
          }
          if (this.payDiscountType) {
            orderRequest = {
              ...orderRequest,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              pay_discount_type: this.payDiscountType
            };
          }
          if (this.payDiscountType) {
            orderRequest = {
              ...orderRequest,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              pay_ship_type: this.payShipType
            };
          }
          if (this.shipPartner) {
            orderRequest = {
              ...orderRequest,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              amount_delivery: this.shipPartner === 'taikho' ? 0 : this.shipFee,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              ship_partner: this.shipPartner
            };
          }
          orderRequests.push(orderRequest);
        }
        console.log(orderRequests);
        let orderRequestBody;
        if (this.applyCouponService.getLastCouponsValue() && this.applyCouponService.getLastCouponsValue().length) {
          orderRequestBody = { orderAddressRequest: partnerRequest,
            saleOrders: orderRequests,
            paymentAcquirerId: this.paymentAcquirerId,
            reference: this.reference
          };
        } else {
          orderRequestBody = { orderAddressRequest: partnerRequest,
            saleOrders: orderRequests,
            paymentAcquirerId: this.paymentAcquirerId,
            reference: this.reference
          };
        }
        this.orderService.createOrder(orderRequestBody).subscribe(async (res: any) => {
          this.isLoading = false;
          await this.cartService.removeCarts();
          this.fun.navigate('orders', false);
        },(e) => {
          this.isLoading = false;
          this.ionicCoreService.showToastError({message: 'Tạo đơn hàng không thành công. Bạn vui lòng thử lại sau.'});
        }
      );
    }
  }

  paymentAcquirerChange(event) {
    this.paymentAcquirerId = event.detail.value;
    const method = this.paymentAcquirers.find(p => p.id === Number(this.paymentAcquirerId));
    if (method && method.provider === 'BANK_TRANSFER') {
      this.isShowReference = true;
    } else {
      this.isShowReference = false;
      this.reference = '';
    }
  }

  onShipPartnerChange(event) {
    this.shipPartner = event.detail.value;
    this.shipType = 'normal'
    if (this.shipPartner === 'taikho') {
      this.shipFee = 0;
      return;
    }
    this.calculateShipFee();
  }

  shipTypeChange(event) {
    this.calculateShipFee();
  }

  calculateShipFee() {
    this.getShippingFee(this.form.value.shippingAddress);
  }

  async getShippingFee(address: any) {
    if (!this.customerName || !this.customerPhone || !this.shipPartner || !this.shipType) {
      return;
    }
    const carts = await this.cartService.getProductsIncart();
    const warehouseIds = [];
    const productTmp = [];
    carts.forEach(item => {
      warehouseIds.push(item.product.productWarehouseOdoo.warehouseId);
      productTmp.push({
        product_tmp_id: item.product.productTmplId,
        quantity: item.quantity
      });
    });
    const calShipFeeParams = {
      address,
      phone: this.customerPhone,
      name: this.customerName,
      shipPartner: this.shipPartner,
      shipType: this.shipType,
      wareHouseId: warehouseIds[0]
    };
    this.orderService.getShippingFee(productTmp, calShipFeeParams).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (res: any) => {
        this.shipObject = res;
        this.shipFee = res.ship_fee_only;
      }
    );
  }

  radioSelect(event) {
    this.paymentAcquirerId = event.detail;
  }



  // async back() {
  //   const alert = await this.alertController.create({
  //     header: 'Are you sure?',
  //     message: 'Do you want to cancel entering your payment info?',
  //     buttons: [
  //       {
  //         text: 'Yes',
  //         cssClass: 'mycolor',
  //         handler: (blah) => {
  //           this.fun.back();
  //         }
  //       }, {
  //         text: 'No',
  //         role: 'cancel',
  //         cssClass: 'mycolor',
  //         handler: () => {}
  //       }
  //     ]
  //   });

  //   await alert.present();
  // }

}
