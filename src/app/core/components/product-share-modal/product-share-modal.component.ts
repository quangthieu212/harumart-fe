import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../../environments/environment';
import { Product } from '../../models/Product';
import { MobileUtilsService } from '../../services/mobile-utils.service';
import { SocialSharingService } from '../../services/social-sharing.service';

@Component({
    selector: 'app-product-share-modal',
    templateUrl: './product-share-modal.component.html',
    styleUrls: ['./product-share-modal.component.scss'],
})
export class ProductShareModalComponent implements OnInit {
    @Input() product: Product;
    // @Input() productImgElements: HTMLImageElement[];

    canShareImages: boolean;
    canShareDescription: boolean;

    doneShareImages: boolean;
    doneShareDescription: boolean;
    imageUrl = environment.imageUrl;

    constructor(
        private modalCtrl: ModalController,
        private socialSharingService: SocialSharingService,
        private utilsService: MobileUtilsService,
    ) {
    }

    ngOnInit() {
        this.canShareDescription = this.getMessage() !== '';
        this.canShareImages = this.getImgSrcs().length > 0;
    }

    shareImgs() {
        // return this.socialSharingService.shareImgs(
        //     this.getImgSrcs(),
        //     this.productImgElements
        // ).finally(() => {
        //     this.doneShareImages = true;
        //     this.closeModal();
        // });
        return this.socialSharingService.shareText(
            this.getSubject(),
            this.getImgSrcs()[0],
        ).finally(() => {
            this.doneShareImages = true;
            this.closeModal();
        });
    }

    closeModal() {
        if (
            ((this.canShareImages && this.doneShareImages) || !this.canShareImages) &&
            ((this.canShareDescription && this.doneShareDescription) || !this.canShareDescription)
        ) {
            setTimeout(() => {
                this.modalCtrl.dismiss();
            }, 200);
        }
    }

    shareDescription() {
        return this.socialSharingService.shareText(
            this.getSubject(),
            this.getMessage(),
        ).finally(() => {
            this.doneShareDescription = true;
            this.closeModal();
        });
    }

    getImgSrcs() {
        return this.product.productTempImage.map(i => `${this.imageUrl}/${i}`);
    }

    getSubject() {
        return this.product.name;
    }

    getMessage() {
        return this.utilsService.convertHtmlSpecialSymbolsToUnicode(this.removeHtml(this.product.description));
    }

    removeHtml(str: string) {
        console.log({ preStr: str });
        str = str.replace(/<td.*?>(.*)?<\/td>[\n]?.*<td.*?>(.*)?<\/td>/gm, '- $1: $2')
        str = str.replace(/<br>/gi, "\n");
        str = str.replace(/<p.*>(.*)<\/p>/gi, "$1\n");
        str = str.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, "$2");
        str = str.replace(/<(?:.|\s)*?>/g, "");
        // multi lines to 1 line
        str = str.replace(/[\r\n]{2,}/g, "\n");
        // multi 4 spaces to 1 spaces
        str = str.replace(/( ){4,4}/g, " ");
        str = str.replace(/(\n[ ]+\n)/g, '\n');
        // limit to 500 words (zalo)
        str = str.split(' ').splice(0, 500).join(' ');
        console.log({ afterStr: str });
        return str;
    }

    onCancel() {
        this.modalCtrl.dismiss();
    }

    onOk() {
        this.modalCtrl.dismiss();
    }
}
