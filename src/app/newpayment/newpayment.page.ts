import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';
import { DataService } from '../data.service';
import { FunctionsService } from '../functions.service';

@Component({
  selector: 'app-newpayment',
  templateUrl: './newpayment.page.html',
  styleUrls: ['./newpayment.page.scss'],
})
export class NewpaymentPage implements OnInit {

  constructor(private menuCtrl: MenuController, public fun: FunctionsService, public dataService: DataService, private alertController: AlertController) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  done(){
    this.fun.back();
  }

  async back() {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'Do you want to cancel entering your payment info?',
      buttons: [
        {
          text: 'Yes',
          cssClass: 'mycolor',
          handler: (blah) => {
            this.fun.back();
          }
        }, {
          text: 'No',
          role: 'cancel',
          cssClass: 'mycolor',
          handler: () => {}
        }
      ]
    });

    await alert.present();
  }

}
