import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DataService } from './data.service';
import { FunctionsService } from './functions.service';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from './core/services/auth.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { User } from './core/models/User';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

  side_open = true;
  side_open1 = true;
  user: User;
  // isLogin = true;
  closed$ = new Subject<any>();

  public appPages = [
    { title: 'Trang chủ', url: '/home', icon: 'home' },
    { title: 'Tìm kiếm', url: '/search', modal: true, icon: 'search' },
    // { title: 'Thông báo', url: '/notification', icon: 'notifications' },
    { title: 'Giỏ hàng', url: '/cart', icon: 'cart' },
    { title: 'Lịch sử đơn hàng', url: '/orders', icon: 'list' },
    { title: 'Doanh thu', url: '/doanh-thu', icon: 'bar-chart-outline' },
    // { title: 'Wish Cash', url: '/wishcash', icon: 'wallet' },
    // { title: 'Rewards', url: '/rewards', icon: 'trophy' },
    // { title: 'Apply Promo', url: '/applypromo', icon: 'megaphone' }
  ];
  public appPages1 = [
    // { title: 'Customer Support', url: '/support', icon: 'people' },
    // { title: 'FAQs', url: '/faqs', icon: 'help-circle' },
    // { title: 'Cài đặt', url: '/settings', icon: 'cog' }
  ];

  colors = [
    'Bronze',
    'Black',
    'Blue',
    'Clear',
    'Gold',
    'Gray',
    'Green',
    'Multi-Color',
    'Orange',
    'Pink',
    'Red',
    'Silver',
    'White',
    'Yellow',
    'Brown',
    'Purple',
    'Beige'
  ];

  menu(b){
    if(b){
      this.side_open = false;
      this.side_open1 = true;
    }
    else {
      this.side_open = false;
      this.side_open1 = false;
    }
  }

  back(){
    this.side_open = true;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    public dataService: DataService,
    public fun: FunctionsService,
    private storage: Storage,
    public auth: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }
  ngOnDestroy(): void {
    this.closed$.next();
    this.closed$.complete();
  }
  async ngOnInit() {
    await this.storage.create();
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.closed$)
    ).subscribe(async (event) => {
      // const isLogin = await this.auth.isLogin();
      const userData = await this.auth.getUser();
      if (userData) {
        this.appPages1 = [
          { title: 'Thông tin về Harumart', url: '/info-app', icon: 'information' }
        ];
        this.user = userData;
      } else {
        this.appPages1 = [
          { title: 'Thông tin về Harumart', url: '/info-app', icon: 'information' },
          { title: 'Đăng nhập', url: '/login', icon: 'log-in' }
        ];
      }

      // if (event['url'] === '/login' || event['url'] === 'signup') {
      //    // <-- hide tabs on specific pages
      //   this.appPages1 = [
      //     { title: 'Đăng nhập', url: '/login', icon: 'log-in' }
      //   ];
      // } else {
      //   this.appPages1 = [];
      //   this.isLogin = true;
      // }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // this.splashScreen.hide();
    });
  }
}
