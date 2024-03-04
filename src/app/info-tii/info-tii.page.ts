import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';


@Component({
  selector: 'app-info-tii',
  templateUrl: './info-tii.page.html',
  styleUrls: ['./info-tii.page.scss'],
})
export class InfoTiiPage implements OnInit {
  constructor(
    public fun: FunctionsService
  ) { }

  async ngOnInit() {

  }

  async ionViewWillEnter() {
  }

}
