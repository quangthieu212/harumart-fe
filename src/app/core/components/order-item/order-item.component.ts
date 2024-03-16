import { Component, Input, OnInit } from '@angular/core';
import { OrderLine, SaleOrder } from '../../models/Order';
import { UtilService } from '../../services/util.service';
import { ModalController } from '@ionic/angular';
import { StateOrderModalComponent } from '../state-order-modal/state-order-modal.component';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
})
export class OrderItemComponent implements OnInit {
  @Input() order: SaleOrder;
  STATE_SALE_ORDER = {
    sale: 'Đã xác nhận',
    sale_accept: 'Nhận đơn',
    sale_wait_get: 'Chờ lấy hàng',
    sale_cancel_get: 'Không lấy được hàng',
    sale_wait_ship: 'Chờ giao hàng',
    sale_shipping: 'Đang giao hàng',
    sale_cancel_ship: 'Không giao được hàng'
  };
  constructor(
    public utilService: UtilService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  async showModalTimeLine(item: OrderLine) {
    const modal = await this.modalCtrl.create({
      component: StateOrderModalComponent,
      componentProps: {
        state: Object.keys(this.STATE_SALE_ORDER).indexOf(item.state)
      },
      id: 'state-modal'
    });
    modal.present();
  }

}
