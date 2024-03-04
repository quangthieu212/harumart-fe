import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommissionPage } from './commission.page';
import { ComponentsModule } from '../core/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: CommissionPage
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
  declarations: [CommissionPage],
  entryComponents: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class CommissionPageModule {}
