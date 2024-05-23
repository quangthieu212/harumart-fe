import { Component, OnInit } from '@angular/core';
import { Product } from '../core/models/Product';
import { ProductService } from '../core/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  searchTerm: string;
  searchTerms$ = new Subject<string>();

  pageSize = 10;
  pageNumber = 1;
  maxPage = 0;

  products: Array<Product> = [];
  categoryId = null;

  isLoading = false;

  productFilter = {
    pageSize: this.pageSize,
    pageNumber: this.pageNumber
  };

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.searchTerms$.pipe(
      debounceTime(250),
      distinctUntilChanged(),
    ).subscribe((searchValue: string) => {
      // Remember value after debouncing
      this.searchTerm = searchValue;
      // this.showLoading = true;
      this.loadProductConfirms(null, true);
    });
  }

  ionViewWillEnter() {
    this.products = [];
    this.pageNumber = 1;
    this.categoryId = this.activatedRoute.snapshot.queryParams.categoryId;
    this.loadProductConfirms();
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

  loadProductConfirms(infiniteScroll?, isForceLoad = false) {
    this.isLoading = true;
    this.productFilter.pageNumber = this.pageNumber;
    this.productService.searchProduct(this.searchTerm, {
      ...this.productFilter,
      categoryId: this.categoryId
    }).subscribe((result: any) => {
      if (result.isSuccess) {
        const totalRecords = result.totalRecords;
        this.maxPage = this.round(Math.ceil(totalRecords/this.pageSize), 0);
        console.log('searchTerm', this.searchTerm);
        this.products = isForceLoad ? result.data.products : this.products.concat(result.data.products);
        console.log('products', this.products);
        console.log('result.data.products)', result.data.products);
        // this.filterProductByWarehouse();
      }
      if (infiniteScroll) {
        infiniteScroll.target.complete();
      }
      this.isLoading = false;
    });
  }

  round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  searchByValue(event) {
    this.searchTerms$.next(event.target.value);
  }

}
