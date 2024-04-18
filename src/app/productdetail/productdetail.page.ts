import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { DataService, HomeTab } from '../data.service';
import { IonSlides, MenuController, NavController, IonContent } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../core/services/product.service';
import { Subject, forkJoin } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MapProduct, Product } from '../core/models/Product';
import { CartService } from '../core/services/cart.service';
import { MapProductsService } from '../core/services/map-products.service';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.page.html',
  styleUrls: ['./productdetail.page.scss'],
})
export class ProductdetailPage implements OnInit, OnDestroy {

  @ViewChild('Slides') slides: IonSlides;
  @ViewChild('Content') content: IonContent;
  @ViewChild('slider') slider: IonSlides;

  index = 0;
  segment = '';
  slideOpts = {
    effect: 'flip',
    zoom: false
  };

  data: Array<HomeTab> = [];
  ngUnsubscribe = new Subject();
  isLoading = false;
  productId: string;
  product: Product;
  mapProducts: MapProduct[];
  currentWarehouse: MapProduct;

  constructor(
    private menuCtrl: MenuController,
    public fun: FunctionsService,
    public dataService: DataService,
    private nav: NavController,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private mapProductsService: MapProductsService
    ) {

    this.productId = this.activatedRoute.snapshot.paramMap.get('id');

    // this.product = dataService.current_product;
    // this.data = dataService.item_tab;
    // this.segment = this.data[0].title;
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.isLoading = true;
    this.mapProducts = this.mapProductsService.getLastMapProductsValue();
    this.productService.getProductById(this.productId)
    .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: any) => {
        if (result.isSuccess) {
          if (result.data.mapsProducts && !this.mapProducts) {
            this.mapProducts = result.data.mapsProducts;
            this.mapProductsService.updateMapProducts(result.data.mapsProducts);
          }
          if (this.mapProducts) {
            this.getQtyAvailable().subscribe((res: any) => {
              this.product = result.data;
              this.product.mapsProducts = res;
            });
          } else {
            this.product = result.data;
          }
        }
    },
    (e) => {
      console.log(e);
    },
    () => {
      this.isLoading = false;
    }
    );
  }

  getQtyAvailable() {
    const mapProductsObs = [];
    this.mapProducts.forEach((mapProduct) => {
      mapProductsObs.push(this.productService.getProductById(mapProduct.id).pipe(
        takeUntil(this.ngUnsubscribe),
        map(
          (res: any) => ({
            ...mapProduct,
            qtyAvailable: res.data.qtyAvailable
            })
        )
      ));
    });

    return forkJoin(mapProductsObs);
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  async change() {
    await this.slides.getActiveIndex().then(d => this.index = d);
    this.segment = this.data[this.index].title;
    this.drag();
  }

  onReviewClick(index) {
    this.segment = this.data[index].title;
    this.index = index;
    this.slides.slideTo(index);
    this.content.scrollToTop();
    this.drag();

  }

  selecWarehouse(value) {
    this.currentWarehouse = value;
  }

  async goToCart() {
    if (this.product.categoryOdooId === 40) {
      await this.cartService.addProductToCart(this.product);
      this.fun.navigate('cart', false);
    } else {
      this.productService.getProductById(this.currentWarehouse.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
        async (result: any) => {
          if (result.isSuccess) {
            await this.cartService.addProductToCart(result.data);
            this.fun.navigate('cart', false);
          }
        }
      );
    }
  }

  update(i) {
    this.slides.slideTo(i);
  }

  drag() {
    let distanceToScroll = 0;
    for (const index in this.data) {
      if (parseInt(index) < this.index) {
        distanceToScroll = distanceToScroll + document.getElementById('seg_' + index).offsetWidth + 24;
      }
    }
    document.getElementById('dag').scrollLeft = distanceToScroll;
  }

  seg(event) {
    this.segment = event.detail.value;
  }

}
