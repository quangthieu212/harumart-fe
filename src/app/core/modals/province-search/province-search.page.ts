import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { ConfigService } from '../../services/config.service';
import { removeHartVn } from '../../utils/remove-hart-vn';

@Component({
  selector: 'app-province-search',
  templateUrl: './province-search.page.html',
  styleUrls: ['./province-search.page.scss'],
})
export class ProvinceSearchPage implements OnInit {
  @Input() title = 'common.label.selectProvince';
  @Output() select: EventEmitter<any> = new EventEmitter();
  keyword = '';
  @Input() selected: any = null;
  provices$: Observable<{ name: string, id: string }[]>;
  page = 1;
  perPage = 20;
  constructor(
    private configService: ConfigService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.provices$ = this.configService.getProvices();
  }

  onSearch(event) {
    let query: string = event.detail.value;
    this.provices$ = this.configService.getProvices().pipe(
      map(provinces => {
        if (query === '') {
          return provinces;
        }
        return provinces.filter(p => {
          const provinceName = removeHartVn(p.name).toLowerCase().replace(/\s/g, '');
          query = removeHartVn(query).toLowerCase().replace(/\s/g, '');
          return provinceName.indexOf(query) !== -1;
        });
      })
    );
  }
  trackByFn(index, item) {
    return item.id;
  }

  async clickItem(item) {
    this.select.next(item);
    this.selected = item;
    if (await this.modalCtrl.getTop()) {
      this.modalCtrl.dismiss(item);
    }
  }
  onInfiniteScroll(event: HTMLIonInfiniteScrollElement) {
    this.provices$.pipe(
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
