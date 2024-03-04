import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { User } from '../core/models/User';
import { AuthService } from '../core/services/auth.service';
import { FunctionsService } from '../functions.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  isLoading = false;
  user: User;
  isLogin = false;

  constructor(
    private navCtrl: NavController,
    private auth: AuthService,
    public fun: FunctionsService,
  ) { }

  async ionViewWillEnter() {
    this.isLogin = await this.auth.isLogin();
    if (this.isLogin) {
      this.isLoading = true;
      this.initData();
    }
  }

  ngOnInit() {
  }

  async initData() {
    const userData = await this.auth.getUser();
    this.user = userData;
    this.isLoading = false;
  }

  onClickLogOut() {
    this.auth.logout();
  }

  goToEdit() {
    this.navCtrl.navigateRoot('/account-edit', { animationDirection: 'forward' });
  }

  goToDelete() {
    this.navCtrl.navigateRoot('/account-delete', { animationDirection: 'forward' });
  }

  async gotoLogin() {
    await this.navCtrl.navigateBack('/login');
  }

  gotoPointHistory() {
    this.navCtrl.navigateRoot('/point-history', { animationDirection: 'forward' });
  }

}
