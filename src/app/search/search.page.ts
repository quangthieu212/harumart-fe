import { Component, OnInit, ViewChild } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { DataService } from '../data.service';
import { HomePage } from '../home/home.page';
import { NavController, MenuController, IonInfiniteScroll } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductService } from '../core/services/product.service';
import { Product } from '../core/models/Product';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @ViewChild('IonInfiniteScroll') infiniteScroll: IonInfiniteScroll;

  trending = [];
  recent = [];

  // search
  pageSize = 30;
  pageNumber = 1;
  maxPage = 0;

  isLoading = false;

  productFilter = {
    pageSize: this.pageSize,
    pageNumber: this.pageNumber
  };
  searchValue = '';
  debouncedInputValue = '';
  searchDecouncer$: Subject<string> = new Subject();
  products: Array<Product> = [];

  constructor(
    private menuCtrl: MenuController,
    public fun: FunctionsService,
    dataService: DataService,
    // private nav: NavController,
    private productService: ProductService) {
    this.trending = dataService.trending;
    // this.recent = dataService.recent;
  }

  ngOnInit() {
    // this.setupSearchDebouncer();
  }

  async ionViewWillEnter() {
    this.setupSearchDebouncer();
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  search(searchValue) {
    this.isLoading = true;
    this.productFilter.pageNumber = this.pageNumber;
    this.productService.searchProduct(searchValue, this.productFilter).subscribe((result: any) => {
      if (result.isSuccess) {
        // const totalRecords = result.totalRecords;
        // this.maxPage = this.round(totalRecords/this.pageSize, 0);
        this.products = result.data.products;
        // if (infiniteScroll) {
        //   this.products = this.products.concat(result.data.products);
        // } else {
        //   this.products = result.data.products;
        // }
      }
      // if (infiniteScroll) {
      //   infiniteScroll.target.complete();
      // }
      this.isLoading = false;
    });
  }

  searchByValue(event) {
    this.searchDecouncer$.next(event);
  }

  round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  // loadData(infiniteScroll) {
  //   this.pageNumber++;
  //   if (this.pageNumber > this.maxPage) {
  //     infiniteScroll.target.disabled = true;
  //     return;
  //   }
  //   this.search(this.searchValue, infiniteScroll);
  //   if (this.pageNumber === this.maxPage) {
  //     infiniteScroll.target.disabled = true;
  //   }
  // }

  private setupSearchDebouncer(): void {
    this.searchDecouncer$.pipe(
      debounceTime(250),
      distinctUntilChanged(),
    ).subscribe((searchValue: string) => {
      // Remember value after debouncing
      this.debouncedInputValue = searchValue;
      // this.showLoading = true;
      this.search(searchValue);
    });
  }
}
