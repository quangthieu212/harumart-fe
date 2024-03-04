import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalController, NavParams } from '@ionic/angular';
import { map, take } from 'rxjs/operators';
import { ConfigService } from '../../services/config.service';
import { removeHartVn } from '../../utils/remove-hart-vn';

@Component({
  selector: 'app-wards-search',
  templateUrl: './wards-search.page.html',
  styleUrls: ['./wards-search.page.scss'],
})
export class WardsSearchPage implements OnInit {
  wards$: Observable<Array<{ name: string, id: string }>>;
  districtId: string;
  page = 1;
  perPage = 20;
  constructor(
    private configService: ConfigService,
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.districtId = this.navParams.get('districtId');
    this.wards$ = this.configService.getWardByDistricts(this.districtId);
  }
  onSearch(event) {
    let query: string = event.detail.value;
    this.wards$ = this.configService.getWardByDistricts(this.districtId).pipe(
      map(wards => {
        if (query === '') {
          return wards;
        }
        return wards.filter(w => {
          const wardName = removeHartVn(w.name).toLowerCase().replace(/\s/g, '');
          query = removeHartVn(query).toLowerCase().replace(/\s/g, '');
          return wardName.indexOf(query) !== -1;
        });
      })
    );
  }
  trackByFn(index, item) {
    return item.id;
  }
  clickItem(item) {
    this.modalCtrl.dismiss(item);
  }
  onInfiniteScroll(event: HTMLIonInfiniteScrollElement) {
    this.wards$.pipe(
      take(1)
    ).subscribe(res => {
      const totalLoaded = this.page * this.perPage;
      if (totalLoaded >= res.length) {
        event.disabled = true;
      } else {
        setTimeout(() => {
          this.page = this.page + 1;
          event.complete();
        }, 500);
      }
    });
  }
}
