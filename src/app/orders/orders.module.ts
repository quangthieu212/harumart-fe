import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OrdersPage } from './orders.page';
import { ComponentsModule } from '../core/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: OrdersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [OrdersPage],
  entryComponents: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class OrdersPageModule {}
