import { Component, Input, OnInit } from '@angular/core';
import { SaleOrder } from '../../models/Order';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
})
export class OrderItemComponent implements OnInit {
  @Input() order: SaleOrder;
  constructor(
    public utilService: UtilService
  ) { }

  ngOnInit() {}

}
