import {Component, OnInit, ViewChild} from '@angular/core';
import {FunctionsService} from "../functions.service";
import {ActivatedRoute} from "@angular/router";
import {IonInfiniteScroll} from "@ionic/angular";
import {Subject} from "rxjs";
import {ProductService} from "../core/services/product.service";
import {takeUntil} from "rxjs/operators";
import {HomeTab} from "../data.service";
import {Product} from "../core/models/Product";

@Component({
  selector: 'app-outstanding-products',
  templateUrl: './outstanding-products.component.html',
  styleUrls: ['./outstanding-products.component.scss'],
})
export class OutstandingProductsComponent implements OnInit {

  @ViewChild('IonInfiniteScroll') infiniteScroll: IonInfiniteScroll;

  ngUnsubscribe = new Subject();
  producerParam: string;
  pageSize = 10;
  pageNumber = 1;
  maxPage = 0;
  isLoading = false;
  data: Array<HomeTab> = [];
  products: Array<Product> = [];
  productFilter = {
    pageSize: this.pageSize,
    pageNumber: this.pageNumber,
    producer: ''
  };
  constructor(
    public fun: FunctionsService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
  ) {
    this.producerParam = this.activatedRoute.snapshot.paramMap.get('producer');
    this.productFilter.producer = this.producerParam;
    this.productService.searchProduct('', this.productFilter)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: any) => {
        if (result.isSuccess) {
          this.products = result.data.products;
          const totalRecords = result.totalRecords;
          this.maxPage = this.round(totalRecords/this.pageSize, 0);
          this.isLoading = false;
        }
      });
  }

  ngOnInit() {}

  round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
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

  loadProductConfirms(infiniteScroll?) {
    this.isLoading = true;
    this.productFilter.pageNumber = this.pageNumber;
    this.productService.searchProduct('', this.productFilter).subscribe((result: any) => {
      if (result.isSuccess) {
        const totalRecords = result.totalRecords;
        this.maxPage = this.round(totalRecords/this.pageSize, 0);
        this.products = this.products.concat(result.data.products);
      }
      if (infiniteScroll) {
        infiniteScroll.target.complete();
      }
      this.isLoading = false;
    });
  }

}
