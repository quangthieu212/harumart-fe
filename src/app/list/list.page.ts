
import { Component, OnInit, Input } from '@angular/core';
import { NotificationsCard } from '../data.service';
import { FunctionsService } from '../functions.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  @Input() data: Array<NotificationsCard>;

  constructor(public fun: FunctionsService) { }

  ngOnInit() {
  }

}
