
import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { HttpClient } from '@angular/common/http';
import { MenuController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-country',
  templateUrl: './country.page.html',
  styleUrls: ['./country.page.scss'],
})
export class CountryPage implements OnInit {

  data: any = [];

  constructor(private loadingController: LoadingController, public fun: FunctionsService, private http: HttpClient, private menuCtrl: MenuController) {
    
    this.present();
    http.get('https://restcountries.eu/rest/v2/all').subscribe(d=>{
      this.data = d;
      this.loadingController.dismiss();
    });
  }

  ngOnInit() {
  }
  
  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'end');
    this.menuCtrl.enable(false, 'start');
  }

  async present(){
    const loading = await this.loadingController.create({
      message: 'Loading'
    });
    return await loading.present();
  }

}
