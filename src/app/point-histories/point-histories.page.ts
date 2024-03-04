import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserDiscount } from '../core/models/Discount';
// import { Chart, registerables } from 'chart.js';
import { UserPointTransaction } from '../core/models/UserPointTransaction';
import { AuthService } from '../core/services/auth.service';
import { UserPointService } from '../core/services/user-point.service';

const USER_DETAIL = 'user-detail';

@Component({
  selector: 'app-point-histories',
  templateUrl: './point-histories.page.html',
  styleUrls: ['./point-histories.page.scss'],
})
export class PointHistoriesPage implements OnInit, OnDestroy {

  isLoading: boolean;
  totalPoint = 0;

  pageSize = 10;
  pageNumber = 1;
  maxPage = 0;
  isLogin = false;

  discount: UserDiscount;
  totalAmountByMonth = 0;
  ngUnsubscribe = new Subject();
  firstDay;
  lastDay;

  barChart: any;
  lineChart: any;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild('lineCanvas') lineCanvas: any;


  constructor(
    private auth: AuthService,
    // private pointTransctionService: PointTransctionService,
    // private ionicCoreService: IonicCoreService,
    private storage: Storage,
    private navCtrl: NavController,
    private userPointService: UserPointService
  ) {
    // Chart.register(...registerables);
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ionViewDidLoad() {
  }

  async ionViewWillEnter() {
    this.getDiscount();

    // this.lineChart = new Chart(this.lineCanvas.nativeElement, {
    //   type: 'line',
    //   data: {
    //       labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    //       datasets: [
    //           {
    //               label: 'Point',
    //               fill: false,
    //               showLine: true,
    //               backgroundColor: 'rgba(75,192,192,0.4)',
    //               borderColor: 'rgba(75,192,192,1)',
    //               borderCapStyle: 'butt',
    //               borderDash: [],
    //               borderDashOffset: 0.0,
    //               borderJoinStyle: 'miter',
    //               pointBorderColor: 'rgba(75,192,192,1)',
    //               pointBackgroundColor: '#fff',
    //               pointBorderWidth: 1,
    //               pointHoverRadius: 5,
    //               pointHoverBackgroundColor: 'rgba(75,192,192,1)',
    //               pointHoverBorderColor: 'rgba(220,220,220,1)',
    //               pointHoverBorderWidth: 2,
    //               pointRadius: 1,
    //               pointHitRadius: 10,
    //               data: [65, 59, 80, 81, 56, 55, 40],
    //               spanGaps: false,
    //           }
    //       ]
    //   }
    // });

    this.isLogin = await this.auth.isLogin();
    if (!this.isLogin) {
      return;
    }
    const userDetail = await this.storage.get(USER_DETAIL);
    this.totalPoint = userDetail.point || 0;
    this.isLoading = true;
    const date = new Date();
    this.firstDay = this.formatDate(new Date(date.getFullYear(), date.getMonth(), 1));
    this.lastDay = this.formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    this.getDiscount();
  }
  getDiscount() {
    this.isLoading = true;
    this.userPointService.getTotalDiscount(this.firstDay, this.lastDay)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((result: any) => {
      if (result.isSuccess) {
        this.discount = result.data;
        if (this.discount.points && this.discount.points.length > 0) {
          this.totalAmountByMonth = this.discount.points.map(p => p?.amount || 0).reduce((p1, p2) => p1 + p2, 0);
        }
      }
      this.isLoading = false;
    }, (e) => {
      this.isLoading = false;
    });
  }

  async ngOnInit() {
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
    return [year, month, day].join('-');
}

  // loadTransactions(infiniteScroll?) {
  //   if (!this.isLogin) {
  //     return;
  //   }
  //   this.isLoading = true;
  //   this.pointTransctionService.getPointTransctions(this.pageSize, this.pageNumber).subscribe((result: any) => {
  //     if (result.isSuccess) {
  //       const totalRecords = result.totalRecords;
  //       this.maxPage = this.round(totalRecords/this.pageSize, 0);
  //       this.pointTransactions = this.pointTransactions.concat(result.data.userPointTransactions);
  //       this.totalPoint = result.data.totalPoint;
  //     }
  //     if (infiniteScroll) {
  //       infiniteScroll.target.complete();
  //     }
  //     this.isLoading = false;
  //   },
  //   (e) => {
  //     this.isLoading = false;
  //     this.ionicCoreService.showToastError({message: 'Mã sản phẩm không hợp lệ. Bạn vui lòng thử sản phẩm khác.'});
  //   })
  // }

  // loadData(infiniteScroll) {
  //   this.pageNumber++;
  //   if (this.pageNumber > this.maxPage) {
  //     infiniteScroll.target.disabled = true;
  //     return;
  //   }
  //   this.loadTransactions(infiniteScroll);

  //   if (this.pageNumber === this.maxPage) {
  //     infiniteScroll.target.disabled = true;
  //   }
  // }

  round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  changeDate(event) {
    const date = new Date(event.target.value);
    this.firstDay = this.formatDate(new Date(date.getFullYear(), date.getMonth(), 1));
    this.lastDay = this.formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    this.getDiscount();
  }

  // async gotoLogin() {
  //   await this.navCtrl.navigateBack(ROUTES.LOGIN);
  // }

}
