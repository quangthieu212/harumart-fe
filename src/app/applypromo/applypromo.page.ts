
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-applypromo',
  templateUrl: './applypromo.page.html',
  styleUrls: ['./applypromo.page.scss'],
})
export class ApplypromoPage implements OnInit {

  constructor(private menuCtrl: MenuController) {
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'end');
    this.menuCtrl.enable(true, 'start');
  }

}
