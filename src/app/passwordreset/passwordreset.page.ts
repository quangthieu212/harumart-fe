
import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.page.html',
  styleUrls: ['./passwordreset.page.scss'],
})
export class PasswordresetPage implements OnInit {

  email = "";

  constructor(public fun: FunctionsService, private menuCtrl: MenuController) { 
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  reset(){
    if(this.fun.validateEmail(this.email)){
      this.fun.presentToast('Verification mail sent', false, 'bottom', 2100);
    }
    else{
      this.fun.presentToast('Wrong Input!', true, 'bottom', 2100);
    }
  }

}
