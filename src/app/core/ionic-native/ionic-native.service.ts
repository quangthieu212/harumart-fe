import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';


@Injectable({
  providedIn: 'root'
})
export class IonicNativeService {

  constructor(
    private platForm: Platform,
    private toastCtrl: ToastController,
    private clipBoardCtrl: Clipboard
  ) {
  }

  copy(text: string) {
    const mess = 'Sao chép';
    if (this.platForm.is('cordova')) {
      this.clipBoardCtrl.copy(text).then(res => {
        this.showToast(mess);
      });
    } else {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast(mess);
      });
    }
  }


  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      position: 'bottom',
      duration: 2000
    });
    await toast.present();
  }
}
