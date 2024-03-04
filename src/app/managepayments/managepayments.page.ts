
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FunctionsService } from '../functions.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-managepayments',
  templateUrl: './managepayments.page.html',
  styleUrls: ['./managepayments.page.scss'],
})
export class ManagepaymentsPage implements OnInit {

  constructor(public dataService: DataService, public fun: FunctionsService, private menuCtrl: MenuController) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }

}