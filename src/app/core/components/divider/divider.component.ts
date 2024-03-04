import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
})
export class DividerComponent implements OnInit {

  @Input() height = 16;
  @Input() innerHeight = 5;
  @Input() color = '#e0e0e0';
  @Input() forceFullWith: boolean;

  constructor() { }

  ngOnInit() {}

}
