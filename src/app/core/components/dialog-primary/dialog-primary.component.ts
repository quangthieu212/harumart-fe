import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-dialog-primary',
    templateUrl: './dialog-primary.component.html',
    styleUrls: ['./dialog-primary.component.scss']
})
export class DialogPrimaryComponent {
    @Input() title = '';
    @Input() showCloseButton = true;
    constructor(
        public modalCtrl: ModalController,
    ) {
    }

    dismiss() {
        this.modalCtrl.dismiss(null);
    }
}
