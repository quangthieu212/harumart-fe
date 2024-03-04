import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { DataService, HomeTab } from '../data.service';
import { IonSlides, MenuController, NavController, IonContent } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../core/services/product.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../core/models/Product';
import { CartService } from '../core/services/cart.service';

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

  constructor(
    private menuCtrl: MenuController,
    public fun: FunctionsService,
    public dataService: DataService,
    private nav: NavController,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService
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
    this.productService.getProductById(this.productId)
    .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: any) => {
        if (result.isSuccess) {
          this.product = result.data;
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

  async goToCart() {
    await this.cartService.addProductToCart(this.product);
    this.fun.navigate('cart', false);
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
