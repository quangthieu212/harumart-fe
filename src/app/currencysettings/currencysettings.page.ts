
import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { MenuController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-currencysettings',
  templateUrl: './currencysettings.page.html',
  styleUrls: ['./currencysettings.page.scss'],
})
export class CurrencysettingsPage implements OnInit {

  currency = "IND";
  data;

  constructor(public fun: FunctionsService, private menuCtrl: MenuController, private http: HttpClient) { }

  ngOnInit() {
    this.get();
  }
  
  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'end');
    this.menuCtrl.enable(false, 'start');
  }

  async get(){
    await this.http.get('https://restcountries.eu/rest/v2/all').subscribe(d=>{
      this.data = d;
      this.currency = this.data[104].alpha3Code;
    });
  }

}
