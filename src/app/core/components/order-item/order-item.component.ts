/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';
import { OrderLine, SaleOrder } from '../../models/Order';
import { UtilService } from '../../services/util.service';
import { AlertController, ModalController } from '@ionic/angular';
import { StateOrderModalComponent } from '../state-order-modal/state-order-modal.component';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

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
  isDaiLy: boolean = false;
  hasPermCompleteOrder: boolean = false;
  constructor(
    public utilService: UtilService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private auth: AuthService,
    private orderService: OrderService,
  ) { }

  async ngOnInit() {
    this.isDaiLy = await this.auth.isDaiLy();
    const phoneNumberCurrentUser = await this.auth.getPhoneNumber();
    if (phoneNumberCurrentUser === '0987887111' || phoneNumberCurrentUser === '0838316416') {
      this.hasPermCompleteOrder = true;
    }
  }

  async showModalTimeLine(state: any) {
    const modal = await this.modalCtrl.create({
      component: StateOrderModalComponent,
      componentProps: {
        state: Object.keys(this.STATE_SALE_ORDER).indexOf(state)
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
          }
        }, {
          text: 'Có',
          handler: (ok) => {
            this.orderService.cancelOrder(this.order.id).subscribe((res: any) => {
              window.location.reload();
            });
          }
        }
      ]
    });

    alert.present();
  }
  async completeOrder() {
    const alert = await this.alertController.create({
      header: 'Xác nhận!',
      message: 'Bạn chắc chắn muốn hoàn thành đơn hàng này không?',
      buttons: [
        {
          text: 'Không',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (cancel) => {
          }
        }, {
          text: 'Có',
          handler: (ok) => {
            this.orderService.completeOrder(this.order.id).subscribe((res: any) => {
              window.location.reload();
            });
          }
        }
      ]
    });

    alert.present();
  }

}
