
import { Component, OnDestroy, ViewChild } from '@angular/core';
import {MenuController, IonSlides, IonInfiniteScroll, NavController} from '@ionic/angular';
import { FunctionsService } from '../functions.service';
import { DataService, HomeTab } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ProductService } from '../core/services/product.service';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../core/models/Product';
import {CouponService} from '../core/services/coupon.service';
import {AuthService} from '../core/services/auth.service';
import {UtilService} from '../core/services/util.service';

const LIST_BANNER = [
  {
    image: 'assets/images/banner-1.jpg',
    producer: null
  },
  {
    image: 'assets/images/banner-2.jpg',
    producer: null
  },
  {
    image: 'assets/images/banner-web-01a.jpg',
    producer: 'sofaco'
  },
  {
    image: 'assets/images/banner-web-02a.jpg',
    producer: 'novare'
  },
  {
    image: 'assets/images/banner-web-03a.jpg',
    producer: 'purecle'
  }
];

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {

  @ViewChild('Slides') slides: IonSlides;
  @ViewChild('IonInfiniteScroll') infiniteScroll: IonInfiniteScroll;

  ngUnsubscribe = new Subject();

  banners = LIST_BANNER;
  segment = '';
  index = 0;
  data: Array<HomeTab> = [];
  products: Array<Product> = [];
  productsOrigin: Array<Product> = [];

  slideOpts = {
    effect: 'flip',
    speed: 400,
    loop: false,
    // autoplay: {
    //   delay: 2500,
    //   disableOnInteraction: false,
    // },
    pagination: {
      el: '.swiper-paginationsss',
      clickable: true,
    },
    zoom: false,
    slidesPerView: 'auto',
    spaceBetween: 1
  };

  slideVouchers = {
    effect: 'flip',
    speed: 400,
    loop: false,
    pagination: {
      el: '.swiper-paginationsss',
      clickable: true,
    },
    zoom: false
  };

  pageSize = 10;
  pageNumber = 1;
  maxPage = 0;

  isLoading = false;

  productFilter = {
    pageSize: this.pageSize,
    pageNumber: this.pageNumber
  };

  producer: string;

  vouchers: any = [];
  promotions: any = [];
  currentUser: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private menuCtrl: MenuController,
    public fun: FunctionsService,
    private productService: ProductService,
    public dataService: DataService,
    private couponService: CouponService,
    private authService: AuthService,
    public utilService: UtilService,
    private nav: NavController,
  ) {

    this.data = dataService.tabs;
    const d = this.activatedRoute.snapshot.paramMap.get('id');
    if (d) {
      this.segment = this.data[parseInt(d, 10)].title;
    } else {
      this.segment = this.data[0].title;
    }

    this.activatedRoute.queryParams.subscribe((params) => {
      this.productFilter = {
        pageSize: this.pageSize,
        pageNumber: 1
      };
      this.products = [];
      if (params.producer) {
        this.producer = params.producer;
      } else {
        this.producer = null;
      }
      this.getData();
    });

    this.isLoading = true;
    this.getVouchers();
    this.getPromotions();
  }

  getData() {
    this.productService.searchProduct('', {
      ...this.productFilter,
      producer: this.producer
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: any) => {
        if (result.isSuccess) {
          this.products = result.data.products;
          // this.filterProductByWarehouse();
          const totalRecords = result.totalRecords;
          this.maxPage = this.round(totalRecords/this.pageSize, 0);
          this.isLoading = false;
        }
      });
  }

  async getVouchers() {
    this.currentUser = await this.authService.getUser();
    this.couponService.getVoucher(this.currentUser)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.vouchers = result || [];
        }
      );
  }

  getPromotions() {
    this.couponService.getPromotions()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.promotions = result;
        }
      );

  }

  getCoupons() {
    this.couponService.getCoupons(this.currentUser)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          console.log(result);
        }
      );

  }

  saveCoupon(item) {
    this.couponService.saveCoupon(item.id, this.currentUser).subscribe(
      (result: any) => {
        this.vouchers.forEach((voucher) => {
          if (voucher.id === item.id) {
            voucher.isSave = true;
          }
        });
      }
    );
  }

  async ionViewWillEnter() {
  }

  filterProductByWarehouse() {
    if (this.segment === this.data[0].title) {
      this.products = this.productsOrigin.filter(item => item.productWarehouseOdoo.warehouseId === 18);
    } else {
      this.products = this.productsOrigin.filter(item => item.productWarehouseOdoo.warehouseId === 17);
    }
  }

  loadProductConfirms(infiniteScroll?) {
    this.isLoading = true;
    this.productFilter.pageNumber = this.pageNumber;
    this.productService.searchProduct('', {
      ...this.productFilter,
      producer: this.producer
    }).subscribe((result: any) => {
      if (result.isSuccess) {
        const totalRecords = result.totalRecords;
        this.maxPage = this.round(totalRecords/this.pageSize, 0);
        this.products = this.products.concat(result.data.products);
        // this.filterProductByWarehouse();
      }
      if (infiniteScroll) {
        infiniteScroll.target.complete();
      }
      this.isLoading = false;
    });
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(true, 'end');
  }

  seg(event) {
    if (event.detail.value === this.segment) {
      return;
    }
    this.segment = event.detail.value;
    this.products = [];
    this.filterProductByWarehouse();
  }

  drag() {
    let distanceToScroll = 0;
    for (const index in this.data) {
      if (parseInt(index, 5) < this.index) {
        distanceToScroll = distanceToScroll + document.getElementById('seg_' + index).offsetWidth + 24;
      }
    }
    document.getElementById('dag').scrollLeft = distanceToScroll;
  }

  preventDefault(e) {
    e.preventDefault();
  }

  async change() {
    // await this.slides.getActiveIndex().then(data => this.index = data);
    // this.segment = this.data[this.index].title;
    // this.drag();
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  side_open() {
    this.menuCtrl.toggle('end');
  }

  update(i) {
    this.slides.slideTo(i).then((res) => console.log('responseSlideTo', res));
  }

  loadData(infiniteScroll) {
    this.pageNumber++;
    if (this.pageNumber > this.maxPage) {
      infiniteScroll.target.disabled = true;
      return;
    }
    this.loadProductConfirms(infiniteScroll);
    if (this.pageNumber === this.maxPage) {
      infiniteScroll.target.disabled = true;
    }
  }

  round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  goToOutstandingProductsPage(banner) {
    if (!banner.producer) {
      return;
    }
    this.nav.navigateForward('/home', {queryParams: {producer: banner.producer}});
  }
}
