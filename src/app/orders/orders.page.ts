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

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit, OnDestroy {

  isLogin = false;
  orders: Array<SaleOrder> = [];
  segment = '';
  statusList = [
    {
      code: OrderStatus.DRAFT,
      title: 'Đơn hàng mới'
    },
    {
      code: OrderStatus.SALE,
      title: 'Đã xác nhận'
    },
    // {
    //   code: OrderStatus.CONFIRMED,
    //   title: 'Chờ giao'
    // },
    // {
    //   code: OrderStatus.DELIVERING,
    //   title: 'Đang giao'
    // },
    // {
    //   code: OrderStatus.DELIVERED,
    //   title: 'Đã giao'
    // },
    {
      code: OrderStatus.DONE,
      title: 'Hoàn thành'
    },
    {
      code: OrderStatus.CANCELED,
      title: 'Đã huỷ'
    },
  ];
  isLoading = false;
  pageSize = 10;
  pageNumber = 1;
  maxPage = 0;

  orderFilter = {
    pageSize: this.pageSize,
    pageNumber: this.pageNumber,
    state: ''
  };
  ngUnsubscribe = new Subject();

  constructor(
    private menuCtrl: MenuController,
    private modalController: ModalController,
    public fun: FunctionsService,
    public dataService: DataService,
    private orderService: OrderService,
    private auth: AuthService
    ) {
    // this.orders = dataService.orders;
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    // this.segment = this.statusList[0].code;
    // this.getOrders();
  }

  async ionViewWillEnter() {
    this.orders = [];
    this.maxPage = 0;
    this.pageNumber = 1;
    this.orderFilter = {
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      state: ''
    };
    this.segment = this.statusList[0].code;
    this.isLogin = await this.auth.isLogin();
    if (!this.isLogin) {
      this.orders = [];
      return;
    }
    this.getOrders();
  }

  getOrders(infiniteScroll?) {
    this.isLoading = true;
    this.orderFilter.state = this.segment;
    this.orderFilter.pageNumber = this.pageNumber;
    this.orderService.getOrdersByUser(this.orderFilter)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: any) => {
        this.isLoading = false;
        if (result.isSuccess) {
          this.orders = this.orders.concat(result.data);
          const totalRecords = result.totalRecords;
          this.maxPage = this.round(Math.ceil(totalRecords/this.pageSize), 0);
          console.log(this.maxPage);
        }
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
    },
    (e) => {
      this.isLoading = false;
    });
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'end');
    this.menuCtrl.enable(true, 'start');
  }

  seg(event) {
    this.segment = event.detail.value;
    this.getOrders();
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
