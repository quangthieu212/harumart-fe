import { Component, OnInit } from '@angular/core';
import { Product } from '../core/models/Product';
import { ProductService } from '../core/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

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

  loadProductConfirms(infiniteScroll?) {
    this.isLoading = true;
    this.productFilter.pageNumber = this.pageNumber;
    this.productService.searchProduct('', {
      ...this.productFilter,
      categoryId: this.categoryId
    }).subscribe((result: any) => {
      if (result.isSuccess) {
        const totalRecords = result.totalRecords;
        this.maxPage = this.round(Math.ceil(totalRecords/this.pageSize), 0);
        this.products = this.products.concat(result.data.products);
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

}
