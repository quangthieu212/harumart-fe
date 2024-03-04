import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { IonicCoreService } from 'src/app/core/services/ionic-core.service';
import { AuthService } from '../core/services/auth.service';
import { FunctionsService } from '../functions.service';

@Component({
  selector: 'app-account-delete',
  templateUrl: './account-delete.page.html',
  styleUrls: ['./account-delete.page.scss'],
})
export class AccountDeletePage implements OnInit {

  isLoading = false;
  constructor(
    public fun: FunctionsService,
    private storage: Storage,
    private authService: AuthService,
    private ionicCoreService: IonicCoreService
  ) { }

  async ngOnInit() {

  }

  async ionViewWillEnter() {
  }


  deleteAccount() {
    this.isLoading = true;
    this.authService.delete().subscribe((res: any) => {
      this.isLoading = false;
      this.ionicCoreService.showToastSuccess({message: 'Bạn đã xoá tài khoản thành công.', duration: 3000});
      this.fun.navigate('/login');
    }, (e) => {
      this.isLoading = false;
      this.ionicCoreService.showToastError({message: 'Đã xảy ra lỗi. Bạn vui lòng thử lại sau.', duration: 3000});
    });
  }

}
