import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { FunctionsService } from '../functions.service';
import { DataService, Orders } from '../data.service';
// import { OrderinfoPage } from '../orderinfo/orderinfo.page';
import { OrderStatus, SaleOrder } from '../core/models/Order';
import { OrderService } from '../core/services/order.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { Commission, CommissionRequest } from '../core/models/Commission';
import { CommissionService } from '../core/services/commission.service';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.page.html',
  styleUrls: ['./commission.page.scss'],
})
export class CommissionPage implements OnInit, OnDestroy {

  isLogin = false;
  userId;
  commission: Commission;
  orders: Array<SaleOrder>;
  isShowOrders = false;
  firstDay;
  lastDay;

  segment = '';
  statusList = [
    {
      code: 'ban-le',
      title: 'Bán lẻ'
    },
    {
      code: 'nhom',
      title: 'Nhóm'
    }
  ];
  isLoading = false;
  pageSize = 10;
  pageNumber = 1;
  maxPage = 0;

  orderFilter = {
    pageSize: this.pageSize,
    pageNumber: this.pageNumber,
    state: OrderStatus.DONE,
    fromDate: '',
    toDate: ''
  };
  ngUnsubscribe = new Subject();

  constructor(
    private menuCtrl: MenuController,
    public fun: FunctionsService,
    private commissionService: CommissionService,
    private orderService: OrderService,
    private auth: AuthService
    ) {
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.segment = this.statusList[0].code;
    this.isLogin = await this.auth.isLogin();
    if (!this.isLogin) {
      this.commission = null;
      return;
    }
    this.userId = (await this.auth.getUser()).odooUserId;
    const date = new Date();
    this.firstDay = this.formatDate(new Date(date.getFullYear(), date.getMonth(), 1));
    this.lastDay = this.formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    const request: CommissionRequest = {
      start: this.firstDay,
      end: this.lastDay,
      userId: this.userId
    };
    this.getCommission(request);
  }

  getCommission(request) {
    this.isLoading = true;
    this.commissionService.getCommissionByUserId(request)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: any) => {
        this.isLoading = false;
        if (result.isSuccess) {
          this.commission = result.data;
          const totalRecords = result.totalRecords;
          this.maxPage = this.round(totalRecords/this.pageSize, 0);
        }
    },
    (e) => {
      this.isLoading = false;
    });
  }

  getOrders() {
    this.isLoading = true;
    this.orderFilter.fromDate = this.firstDay;
    this.orderFilter.toDate = this.lastDay;
    this.orderService.getOrdersByUser(this.orderFilter)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: any) => {
        this.isLoading = false;
        if (result.isSuccess) {
          this.orders = result.data;
          const totalRecords = result.totalRecords;
          this.maxPage = this.round(totalRecords/this.pageSize, 0);
        }
    },
    (e) => {
      this.isLoading = false;
    });
    this.isShowOrders = true;
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'end');
    this.menuCtrl.enable(true, 'start');
  }

  changeDate(event) {
    const date = new Date(event.target.value);
    this.firstDay = this.formatDate(new Date(date.getFullYear(), date.getMonth(), 1));
    this.lastDay = this.formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    const request: CommissionRequest = {
      start: this.firstDay,
      end: this.lastDay,
      userId: this.userId
    };
    this.getCommission(request);
  }

  formatDate(d: Date) {
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2){
      day = '0' + day;
    }
    return [month, day, year].join('/');
}

  seg(event) {
    this.segment = event.detail.value;
  }

  round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  update(i) {
  }

  loadData(event) {
  }

}
