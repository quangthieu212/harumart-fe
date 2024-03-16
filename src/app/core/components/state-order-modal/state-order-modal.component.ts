import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-state-order-modal',
  templateUrl: './state-order-modal.component.html',
  styleUrls: ['./state-order-modal.component.scss'],
})
export class StateOrderModalComponent implements OnInit {
  state: number = 0;

  constructor() { }

  ngOnInit() {}

}
