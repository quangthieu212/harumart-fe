/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */

import { Component, ViewChild } from '@angular/core';
import { MenuController, IonSlides, IonInfiniteScroll } from '@ionic/angular';
import { FunctionsService } from '../functions.service';
import { DataService, HomeTab, Product } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ProductService } from '../core/services/product.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-produtcmain',
  templateUrl: 'productmain.page.html',
  styleUrls: ['productmain.page.scss'],
})
export class ProductMainPage {

  @ViewChild('Slides') slides: IonSlides;

  ngUnsubscribe = new Subject();

  segment = '';
  index = 0;
  data: Array<HomeTab> = [];
  sponsored: Array<Product> = [];


  product_data_1: Array<Product> = [];
  product_data_2: Array<Product> = [];
  product_data_3: Array<Product> = [];
  product_data_4: Array<Product> = [];
  product_data_5: Array<Product> = [];
  slideOpts = {
    effect: 'flip',
    zoom: false
  };

  pageSize = 10;
  pageNumber = 1;
  maxPage = 0;

  productFilter = {
    pageSize: this.pageSize,
    pageNumber: this.pageNumber
  };

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;


  constructor(
    private activatedRoute: ActivatedRoute,
    private menuCtrl: MenuController,
    public fun: FunctionsService,
    private productService: ProductService,
    public dataService: DataService) {

    this.data = dataService.tabs;
    this.sponsored = dataService.sponsored;
    this.product_data_1 = dataService.products_1;
    this.product_data_2 = dataService.products_2;
    this.product_data_3 = dataService.products_3;
    this.product_data_4 = dataService.products_4;
    this.product_data_5 = dataService.products_5;

    this.productService.searchProduct('',this.productFilter)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: any) => {
        if (result.isSuccess) {
          const totalRecords = result.totalRecords;
          this.maxPage = this.round(totalRecords/this.pageSize, 0);
        }
    });


    const d = this.activatedRoute.snapshot.paramMap.get('id');
    if (d) {
      this.segment = this.data[parseInt(d, 10)].title;
    } else {
      this.segment = this.data[0].title;
    }
  }

  async ionViewWillEnter() {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(true, 'end');
  }

  seg(event) {
    this.segment = event.detail.value;
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
    // this.loadProductConfirms(infiniteScroll);
    if (this.pageNumber === this.maxPage) {
      infiniteScroll.target.disabled = true;
    }
  }

  round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
}
