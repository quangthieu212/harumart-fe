
import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { DataService } from '../data.service';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-addressbook',
  templateUrl: './addressbook.page.html',
  styleUrls: ['./addressbook.page.scss'],
})
export class AddressbookPage implements OnInit {

  constructor(private nav: NavController, public fun: FunctionsService, public dataService: DataService, private menuCtrl: MenuController) { }

  ngOnInit() {
  }
  
  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'end');
    this.menuCtrl.enable(false, 'start');
  }

  open(){
    this.nav.navigateForward("/NewAddress/$0");
  }

}
