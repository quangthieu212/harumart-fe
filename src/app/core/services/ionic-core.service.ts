import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ToastOptions, AlertOptions, LoadingOptions, AlertButton } from '@ionic/core';


const DEFAULT_TOAST_OPTIONS: ToastOptions = {
    duration: 3000,
    message: '',
    position: 'top',
    color: 'primary',
    mode: 'md'
};

@Injectable({
    providedIn: 'root'
})
export class IonicCoreService {
    loading: HTMLIonLoadingElement;

    constructor(
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController
    ) {
    }

    // for toast
    async showToast(options?: ToastOptions) {
        let toastOptions: ToastOptions = {
            ...DEFAULT_TOAST_OPTIONS
        };
        if (options) {
            toastOptions = {...DEFAULT_TOAST_OPTIONS, ...options};
        }

        const toast = await this.toastCtrl.create(toastOptions);
        toast.present();
    }

    async showToastSuccess(options?: ToastOptions) {
        let toastOptions: ToastOptions = {
            ...DEFAULT_TOAST_OPTIONS,
            color: 'primary'
        };
        if (options) {
            toastOptions = {...DEFAULT_TOAST_OPTIONS, ...options, color: 'primary'};
        }

        const toast = await this.toastCtrl.create(toastOptions);
        toast.present();

    }

    async showToastError(options?: ToastOptions) {
        let toastOptions: ToastOptions = {
            ...DEFAULT_TOAST_OPTIONS,
            color: 'danger'
        };
        if (options) {
            toastOptions = {...toastOptions, ...options};
        }

        const toast = await this.toastCtrl.create(toastOptions);
        toast.present();
    }

    async showToastWarning(options?: ToastOptions) {
        let toastOptions: ToastOptions = {
            ...DEFAULT_TOAST_OPTIONS,
            color: 'warning'
        };
        if (options) {
            toastOptions = {...toastOptions, ...options};
        }

        const toast = await this.toastCtrl.create(toastOptions);
        toast.present();
    }

    // for alert
    async showAlert(options?: IAlertOptions, callback?: AlertCallBackFn) {
        let alertOptions: IAlertOptions = {
            message: '',
            cssClass: 'alert-primary',
            buttons: [
                {id: 'cancel', text: "Huỷ bỏ"}
            ]
        };
        if (options) {
            if (options.buttons) {
                alertOptions.buttons = alertOptions.buttons.concat(options.buttons);
                alertOptions.buttons.forEach(btn => btn.handler = () => {
                    callback(btn.id);
                });
            }
            alertOptions = {...alertOptions, ...options, buttons: alertOptions.buttons};
        }
        const alert = await this.alertCtrl.create(alertOptions);
        alert.present();
    }

    async showAlertRetry(callback: AlertCallBackFn) {
        this.showAlert({
            message: "Có lỗi xảy ra, Vui lòng thử lại",
            buttons: [
                {id: 'retry', text: "Thử lại"}
            ]
        }, callback);
    }

    async showAlertConfirm(mess: string, callback: AlertCallBackFn) {
        this.showAlert({
            message: mess,
            buttons: [
                {id: 'ok', text: "Xác nhận"}
            ]
        }, callback);
    }

    // for loading
    async showLoading(options?: LoadingOptions) {
        const previousLoading = await this.loadingCtrl.getTop();
        if (previousLoading) {
            await previousLoading.dismiss();
        }
        let loadingOptions: LoadingOptions = {
            duration: 40000,
            backdropDismiss: false,
            message: `Vui lòng đợi ...`
        };
        if (options) {
            loadingOptions = {...loadingOptions, ...options};
        }
        this.loading = await this.loadingCtrl.create(loadingOptions);
        this.loading.present();
    }

    hideLoading() {
        if (this.loading) {
            return this.loading.dismiss().then(() => {
                this.loading = null;
            });
        }
    }

    // add more
    showToastActionFail(message?: string) {
        this.showToastError({message: message || "Có lỗi xảy ra, Vui lòng thử lại" , duration: 3000});
    }

    showToastActionSuccess(message?: string) {
        this.showToastSuccess({message: message || "Thành công", duration: 3000, color: 'success'});
    }
}


interface IAlertOptions extends AlertOptions {
    buttons: Array<IAlertButtonOptions>;
}

interface IAlertButtonOptions extends AlertButton {
    id?: AlertButtonType;
}

type AlertButtonType = 'ok' | 'cancel' | 'retry';
type AlertCallBackFn = (params: AlertButtonType) => void;


