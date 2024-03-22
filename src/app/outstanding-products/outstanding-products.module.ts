import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule, Routes} from '@angular/router';
import {ComponentsModule} from '../core/components/components.module';
import {ProductlistPageModule} from '../productlist/productlist.module';
import {OutstandingProductsComponent} from './outstanding-products.component';

const routes: Routes = [
  {
    path: '',
    component: OutstandingProductsComponent
  }
];

@NgModule({
  declarations: [
    OutstandingProductsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    ProductlistPageModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class OutstandingProductsModule { }
