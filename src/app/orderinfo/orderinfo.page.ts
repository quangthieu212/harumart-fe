import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Orders } from '../data.service';
import { FunctionsService } from '../functions.service';

@Component({
  selector: 'app-orderinfo',
  templateUrl: './orderinfo.page.html',
  styleUrls: ['./orderinfo.page.scss'],
})
export class OrderinfoPage implements OnInit {

  order: Orders;

  constructor(
    private modalController: ModalController,
    // private params: NavParams,
    public fun: FunctionsService
  ) {
    // this.order = params.get('value');
  }

  ngOnInit() {
  }

  dismiss(){
    this.modalController.dismiss();
  }

}
