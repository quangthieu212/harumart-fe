
import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { DataService } from '../data.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {

  conversation = [
    { text: 'Hi user, how may I help you?', sender: 0, image: 'assets/images/sg.jpg' },
    { text: 'I need some coffee, maybe!', sender: 1, image: 'https://tanaytoshniwal.me/assets/images/icon_favo.jpg' },
    { text: 'I can\'t give you that! Sorry.', sender: 0, image: 'assets/images/sg.jpg' },
    { text: 'Umm Okay!', sender: 1, image: 'https://tanaytoshniwal.me/assets/images/icon_favo.jpg' },
    { text: 'Bye!', sender: 0, image: 'assets/images/sg.jpg' }
  ]

  input = '';

  constructor(public fun: FunctionsService, public dataService: DataService, private menuCtrl: MenuController) { }

  ngOnInit() {
  }
  
  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'end');
    this.menuCtrl.enable(true, 'start');
  }

  send(){
    if(this.input!=''){
      this.conversation.push({text: this.input, sender: 1, image: 'https://tanaytoshniwal.me/assets/images/icon_favo.jpg'});
      this.input = '';
    }
  }

}
