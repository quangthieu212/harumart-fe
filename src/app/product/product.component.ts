import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { DataService } from '../data.service';
import { FunctionsService } from '../functions.service';
import { IonSlides, AlertController, ModalController } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { MapProduct, Product } from '../core/models/Product';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { ProductShareModalComponent } from '../core/components/product-share-modal/product-share-modal.component';
import { IonicNativeService } from '../core/ionic-native/ionic-native.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  inputs: ['product', 'slider']
})
export class ProductComponent implements OnInit {
  @Input() product: Product;
  @Input() slider: IonSlides;
  // eslint-disable-next-line @typescript-eslint/ban-types
  @Output() notify: EventEmitter<Number> = new EventEmitter<Number>();
  @Output() selectWarehouse: EventEmitter<MapProduct> = new EventEmitter<MapProduct>();
  @ViewChildren('productImg') productImgElements: QueryList<ElementRef<HTMLImageElement>>;

  slideOpts = {
    effect: 'flip'
  };
  open = [false, false, false, false];
  liked = false;
  imageUrl = environment.imageUrl;
  webUrl = environment.webUrl;
  currentWarehouse: MapProduct;

  constructor(public alertController: AlertController,
    public fun: FunctionsService, public dataService: DataService,
    public sanitizer: DomSanitizer,
    private modalCtrl: ModalController,
    private ionicNativeService: IonicNativeService,
    private socialSharing: SocialSharing
    ) { }

  ngOnInit() {
  }

  changeWarehouse(value: MapProduct) {
    this.currentWarehouse = value;
    this.selectWarehouse.emit(value);
  }

  goToReviews() {
    this.notify.emit(2);
  }

  toogle(i) {
    this.open[i] = !this.open[i];
  }

  remove() {
    this.slider.lockSwipes(true);
  }

  gainback() {
    this.slider.lockSwipes(false);
  }

  like() {
    console.log('like');
    this.liked = !this.liked;
  }

  shareViaInstagram(img) {
    // Check if sharing via email is supported
    this.socialSharing.canShareVia('instagram').then(() => {
      // Sharing via email is possible
      this.socialSharing.shareViaInstagram('Find more such apps at ', 'www/' + img).then(() => {
        // Success!
      }).catch(() => {
        // Error!
        this.createAlert('Error sharing product via Instagram. Please check if you have Instagram app on the device')
      });
    }).catch(() => {
      // Sharing via email is not possible
      this.createAlert('Could not find Instagram app on the device. Please install Instagram and try again.')
    });
  }

  async createAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Sorry',
      subHeader: 'App not found',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  shareCommon() {
    this.modalCtrl.create({
        component: ProductShareModalComponent,
        cssClass: 'modal-transparent',
        componentProps: {
            product: this.product,
            // productImgElements: this.productImgElements.map(ref => ref.nativeElement),
        }
    }).then(m => m.present());
  }

  copy() {
    this.ionicNativeService.copy(`${this.webUrl}productdetail/${this.product.id}`);
  }

  share() {
    // Share via email
    this.socialSharing.shareWithOptions(
        {
        subject: this.product.name,
        url: this.product.productTempImage ? this.product.productTempImage[0] : ''
      }
    ).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
}
