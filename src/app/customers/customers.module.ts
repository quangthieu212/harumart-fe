import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CustomersPage } from './customers.page';
import { ComponentsModule } from '../core/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: CustomersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [CustomersPage],
  entryComponents: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class CustomersPageModule {}
