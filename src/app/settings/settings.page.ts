
import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, ModalController } from '@ionic/angular';
import { FunctionsService } from '../functions.service';
import { InfomodalPage } from '../infomodal/infomodal.page';
import { DataService } from '../data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  items = [
    { name: 'Notifications', url: 'notificationssettings' },
    { name: 'Email Settings', url: 'emailsettings' },
    { name: 'Account Settings', url: 'accountsettings' },
    { name: 'Manage Addresses', url: 'addressbook' },
    { name: 'Manage Payments', url: 'managepayments' },
    { name: 'Currency Settings', url: 'currencysettings' },
    { name: 'Data Control', url: 'datacontrol' },
    { name: 'Logout', url: 'login' }
  ];

  constructor(private navCtrl: NavController, public fun: FunctionsService, private menuCtrl: MenuController, private page: NavController, public dataService: DataService, private modalController: ModalController) { }

  ngOnInit() {
  }
  
  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'end');
    this.menuCtrl.enable(true, 'start');
  }

  nav(i){
    if(this.items[i].url == 'login'){
      this.logout();
    }
    else{
      this.navCtrl.navigateForward('/'+this.items[i].url);
    }
  }

  logout(){
    this.page.navigateRoot('/login');
  }

  async open_modal(b){
    let modal;
    if(b){
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: { value: this.dataService.terms_of_use, title: 'Terms of Use' }
      });
    }
    else{
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: { value: this.dataService.privacy_policy, title: 'Privacy Policy' }
      });
    }
    return await modal.present();
  }

}
