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
import { addMonths, format, startOfMonth } from 'date-fns';

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
  firstDayPicker: any;
  lastDayPicker: any;

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
  disableButtonDetail = false;
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
    const currentDate = new Date();
    this.firstDayPicker = format(startOfMonth(new Date()), 'yyyy-MM-dd');
    this.lastDayPicker = format(startOfMonth(addMonths(new Date(), 1)), 'yyyy-MM-dd');

    this.segment = this.statusList[0].code;
    this.isLogin = await this.auth.isLogin();
    this.commission = null;
    this.orders = [];
    this.pageNumber = 1;
    if (!this.isLogin) {
      return;
    }
    this.userId = (await this.auth.getUser()).odooUserId;
    const date = new Date();
    this.firstDay = this.firstDayPicker;
    this.lastDay = this.lastDayPicker;
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
        if (result) {
          this.commission = result;
          this.orders = [];
          this.pageNumber = 1;
          this.disableButtonDetail = false;
        }
    },
    (e) => {
      this.isLoading = false;
    });
  }

  getOrders(infiniteScroll) {
    this.isLoading = true;
    this.disableButtonDetail = true;
    this.orderFilter.fromDate = this.firstDay;
    this.orderFilter.toDate = this.lastDay;
    this.orderFilter.pageNumber = this.pageNumber;
    this.orderService.getOrdersByUser(this.orderFilter)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: any) => {
        this.isLoading = false;
        if (result.isSuccess) {
          this.orders = this.orders.concat(result.data);
          const totalRecords = result.totalRecords;
          this.maxPage = this.round(Math.ceil(totalRecords/this.pageSize), 0);
        }
        if (infiniteScroll) {
          infiniteScroll.target.complete();
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
    this.firstDay = this.firstDayPicker;
    this.lastDay = this.lastDayPicker;
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

  loadData(infiniteScroll) {
    console.log('infiniteScroll');
    this.pageNumber++;
    if (this.pageNumber > this.maxPage) {
      infiniteScroll.target.disabled = true;
      return;
    }
    this.getOrders(infiniteScroll);
    if (this.pageNumber === this.maxPage) {
      infiniteScroll.target.disabled = true;
    }
  }

}
