
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MenuController, IonSlides, IonInfiniteScroll } from '@ionic/angular';
import { FunctionsService } from '../functions.service';
import { DataService, HomeTab } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ProductService } from '../core/services/product.service';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../core/models/Product';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {

  @ViewChild('Slides') slides: IonSlides;
  @ViewChild('IonInfiniteScroll') infiniteScroll: IonInfiniteScroll;

  ngUnsubscribe = new Subject();

  segment = '';
  index = 0;
  data: Array<HomeTab> = [];
  products: Array<Product> = [];
  productsOrigin: Array<Product> = [];

  slideOpts = {
    effect: 'flip',
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private menuCtrl: MenuController,
    public fun: FunctionsService,
    private productService: ProductService,
    public dataService: DataService) {

    this.data = dataService.tabs;
    const d = this.activatedRoute.snapshot.paramMap.get('id');
    if (d) {
      this.segment = this.data[parseInt(d, 10)].title;
    } else {
      this.segment = this.data[0].title;
    }

    this.isLoading = true;
    this.productService.searchProduct('', this.productFilter)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((result: any) => {
      if (result.isSuccess) {
        this.productsOrigin = result.data.products;
        this.filterProductByWarehouse();
        const totalRecords = result.totalRecords;
        this.maxPage = this.round(totalRecords/this.pageSize, 0);
        this.isLoading = false;
      }
    });
  }

  async ionViewWillEnter() {
  }

  filterProductByWarehouse() {
    if (this.segment === this.data[0].title) {
      this.products = this.productsOrigin.filter(item => item.productWarehouseOdoo.warehouseId === 18);
    } else {
      this.products = this.productsOrigin.filter(item => item.productWarehouseOdoo.warehouseId === 19);
    }
  }

  loadProductConfirms(infiniteScroll?) {
    this.isLoading = true;
    this.productFilter.pageNumber = this.pageNumber;
    this.productService.searchProduct('', this.productFilter).subscribe((result: any) => {
      if (result.isSuccess) {
        const totalRecords = result.totalRecords;
        this.maxPage = this.round(totalRecords/this.pageSize, 0);
        this.productsOrigin = this.products.concat(result.data.products);
        this.filterProductByWarehouse();
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
    await this.slides.getActiveIndex().then(data => this.index = data);
    this.segment = this.data[this.index].title;
    this.drag();
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
}
