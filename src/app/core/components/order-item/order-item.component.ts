/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';
import { OrderLine, SaleOrder } from '../../models/Order';
import { UtilService } from '../../services/util.service';
import { AlertController, ModalController } from '@ionic/angular';
import { StateOrderModalComponent } from '../state-order-modal/state-order-modal.component';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
})
export class OrderItemComponent implements OnInit {
  @Input() order: SaleOrder;
  @Input() segment: string;
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
    private modalCtrl: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    console.log(this.segment);
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

  async cancelOrder() {
    const alert = await this.alertController.create({
      header: 'Xác nhận!',
      message: 'Bạn chắc chắn muốn huỷ đơn hàng này không?',
      buttons: [
        {
          text: 'Không',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (cancel) => {
            console.log('Confirm Cancel: blah ', this.order);
            window.location.reload();
          }
        }, {
          text: 'Có',
          handler: (ok) => {
            console.log('Confirm Okay', this.order);
          }
        }
      ]
    });

    alert.present();
  }

}
