import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, MenuController, ModalController } from '@ionic/angular';
import { FunctionsService } from '../functions.service';
import { DataService, Orders } from '../data.service';
// import { OrderinfoPage } from '../orderinfo/orderinfo.page';
import { OrderStatus, SaleOrder } from '../core/models/Order';
import { OrderService } from '../core/services/order.service';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { Customer } from '../core/models/Customer';
import { FormControl } from '@angular/forms';
import { CustomerService } from '../core/services/customer.service';
import { UtilService } from '../core/services/util.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit, OnDestroy {

  @ViewChild('IonInfiniteScroll') infiniteScroll: IonInfiniteScroll;

  searchField: FormControl;
  isLogin = false;

  customers$: Observable<Customer[]>;

  customers: Array<Customer> = [
    // {
    //   displayName: 'Nguyen Van A',
    //   phone: '0987654567',
    //   street: 'Minh Khai, HBT, HN',
    //   street2: 'So 2',
    //   name: 'Nguyen Van A',
    //   createDate: new Date()
    // }
  ];
  isLoading = false;
  pageSize = 10;
  pageNumber = 1;
  maxPage = 0;

  searchValue = '';
  searchDecouncer$: Subject<string> = new Subject();

  filter = {
    pageSize: this.pageSize,
    pageNumber: this.pageNumber,
    type: 'daily',
    searchValue: ''
  };
  ngUnsubscribe = new Subject();

  constructor(
    private menuCtrl: MenuController,
    public fun: FunctionsService,
    public dataService: DataService,
    private customerService: CustomerService,
    private auth: AuthService,
    public utilService: UtilService
    ) {
    this.setupSearchDebouncer();
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.isLogin = await this.auth.isLogin();
    if (!this.isLogin) {
      this.customers = [];
      return;
    }
    this.getCustomers();
  }

  search(event) {
    this.searchDecouncer$.next(event.target.value);
  }

  getCustomers(infiniteScroll?) {
    this.isLoading = true;
    this.filter.searchValue = this.searchValue;
    this.customerService.searchCustomer(this.filter)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: any) => {
        if (result && result.isSuccess) {
          this.customers = result.data;
          const totalRecords = result.totalRecords;
          this.maxPage = this.round(totalRecords/this.pageSize, 0);
        }
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
        this.isLoading = false;
    },
    (e) => {
      if (infiniteScroll) {
        infiniteScroll.target.complete();
      }
      this.isLoading = false;
    });
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'end');
    this.menuCtrl.enable(true, 'start');
  }

  round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  update(i) {
  }

  loadData(infiniteScroll) {
    this.pageNumber++;
    if (this.pageNumber > this.maxPage) {
      infiniteScroll.target.disabled = true;
      return;
    }
    this.getCustomers(infiniteScroll);
    if (this.pageNumber === this.maxPage) {
      infiniteScroll.target.disabled = true;
    }
  }

  private setupSearchDebouncer(): void {
    this.searchDecouncer$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((searchValue: string) => {
      this.searchValue = searchValue;
      this.getCustomers();
    });
  }

}
