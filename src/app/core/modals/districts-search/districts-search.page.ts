import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NavParams, ModalController } from '@ionic/angular';
import { map, take } from 'rxjs/operators';
import { ConfigService } from '../../services/config.service';
import { removeHartVn } from '../../utils/remove-hart-vn';

@Component({
  selector: 'app-districts-search',
  templateUrl: './districts-search.page.html',
  styleUrls: ['./districts-search.page.scss'],
})
export class DistrictsSearchPage implements OnInit {
  provinceId: string;
  page = 1;
  perPage = 20;
  districts$: Observable<Array<{ name: string, id: string, code: string }>>;
  constructor(
    private configService: ConfigService,
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.loadParams();
    this.districts$ = this.configService.getDistrictsByProvice(this.provinceId);
  }

  loadParams() {
    this.provinceId = this.navParams.get('provinceId');
  }

  onSearch(event) {
    let query: string = event.detail.value;
    this.districts$ = this.configService.getDistrictsByProvice(this.provinceId).pipe(
      map(districts => {
        if (query === '') {
          return districts;
        }
        return districts.filter(d => {
          const districtName = removeHartVn(d.name).toLocaleLowerCase().replace(/\s/g, '');
          query = removeHartVn(query).toLocaleLowerCase().replace(/\s/g, '');
          return districtName.indexOf(query) !== -1;
        });
      })
    );
  }
  clickItem(item) {
    this.modalCtrl.dismiss(item);
  }
  onInfiniteScroll(event: HTMLIonInfiniteScrollElement) {
    this.districts$.pipe(
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
