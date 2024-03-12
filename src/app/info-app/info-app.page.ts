import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';


@Component({
  selector: 'app-info-app',
  templateUrl: './info-app.page.html',
  styleUrls: ['./info-app.page.scss'],
})
export class InfoAppPage implements OnInit {
  constructor(
    public fun: FunctionsService
  ) { }

  async ngOnInit() {

  }

  async ionViewWillEnter() {
  }

}
