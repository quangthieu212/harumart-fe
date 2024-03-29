import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import { DataService } from './data.service';
import { resolve } from 'q';


@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor(
    public dataService: DataService,
    private router: Router,
    private toastController: ToastController,
    private nav: NavController, public alertController: AlertController) { }

  navigate(link, forward?) {
    if (forward) {
      this.nav.navigateForward('/' + link);
    } else {
      this.router.navigateByUrl('/' + link);
    }
  }

  navigateWithQuery(link, queryParams) {
    this.router.navigate(['/' + link], queryParams);
  }

  array(i) {
    const l = [];
    for (let j = 0; j < i; j++) {
      l.push(1);
    }
    return l;
  }

  validateEmail(email) {
    // eslint-disable-next-line max-len
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  checkout() {
    if (this.dataService.current_user.address.length === 0) {
      this.nav.navigateForward('/NewAddress/$1');
    } else {
      this.nav.navigateForward('/Checkout');
    }
  }

  async presentToast(message, show_button, position, duration) {
    const toast = await this.toastController.create({
      message: message,
      buttons: [show_button],
      position: position,
      duration: duration
    });
    toast.present();
  }

  back() {
    // this.nav.goBack();
    this.nav.back();
  }

  date(date) {
    const monthNames = [
      'January', 'February', 'March',
      'April', 'May', 'June', 'July',
      'August', 'September', 'October',
      'November', 'December'
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

  update(product) {
    this.dataService.current_product = product;
  }

  removeConform(message?): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: 'Xác nhận!',
        message: message || 'Bạn chắc chắn muốn xoá bản ghi này không?',
        buttons: [
          {
            text: 'Không',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (cancel) => {
              console.log('Confirm Cancel: blah');
              resolve('cancel');
            }
          }, {
            text: 'Có',
            handler: (ok) => {
              console.log('Confirm Okay');
              resolve('ok');
            }
          }
        ]
      });

      alert.present();
    });
  }

  calculate(price, discount) {
    price = price - (price * discount / 100);
    return price.toFixed(2);
  }
}
