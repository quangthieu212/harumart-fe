import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-search-base',
  templateUrl: './modal-search-base.component.html',
  styleUrls: ['./modal-search-base.component.scss'],
})
export class ModalSearchBaseComponent implements OnInit {
  @Input() title: string;
  @Input() keyword: string;
  @Input() searchPlaceholder: string;
  @Output() search: EventEmitter<any> = new EventEmitter();
  @Output() infinite: EventEmitter<any> = new EventEmitter();
  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() { }

  async dismissModal() {
    if (await this.modalCtrl.getTop()) {
      this.modalCtrl.dismiss();
    }
  }
  onSearch(event) {
    this.search.next(event);
  }
  onInfiniteScroll(event) {
    this.infinite.emit(event.target);
  }
}
