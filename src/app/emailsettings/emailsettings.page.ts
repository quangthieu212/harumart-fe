
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FunctionsService } from '../functions.service';

@Component({
  selector: 'app-emailsettings',
  templateUrl: './emailsettings.page.html',
  styleUrls: ['./emailsettings.page.scss'],
})
export class EmailsettingsPage implements OnInit {

  constructor(private menuCtrl: MenuController, public fun: FunctionsService) { }

  ngOnInit() {
  }
  
  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'end');
    this.menuCtrl.enable(false, 'start');
  }

}
