import { Component, OnInit, Input } from '@angular/core';
// import { Product } from '../data.service';
import { FunctionsService } from '../functions.service';
import { NavController } from '@ionic/angular';
import { Product } from '../core/models/Product';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../core/services/auth.service';
import { environment } from '../../environments/environment';
import { MapProductsService } from '../core/services/map-products.service';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.page.html',
  styleUrls: ['./productlist.page.scss'],
  //inputs: ['recieved_data']
})
export class ProductlistPage implements OnInit {

  // eslint-disable-next-line @typescript-eslint/naming-convention
  @Input() recieved_data: Array<Product>;

  isDaiLy = false;
  isLogin = false;
  imageUrl = environment.imageUrl;

  constructor(
    public fun: FunctionsService,
    private nav: NavController,
    public _sanitizer: DomSanitizer,
    public auth: AuthService,
    public mapProductService: MapProductsService
    ) {
  }

  async ngOnInit() {
    this.isDaiLy = await this.auth.isDaiLy();
    this.isLogin = await this.auth.isLogin();
  }

  open(data){
    this.mapProductService.updateMapProducts(data.mapsProducts);
    this.fun.update(data);
    this.nav.navigateForward('/productdetail/' + data.id);
  }

  isNumeric(str) {
    if (typeof str != 'string') {
      return false;
    }
    return !isNaN(parseFloat(str));
  }

}
