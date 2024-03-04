import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CheckoutPage } from './checkout.page';
import { ModalsModule } from '../core/modals/modals.module';
import { AddressFormComponent } from '../core/components/address-form/address-form.component';
import { StringFieldComponent } from '../core/components/string-field/string-field.component';
import { TextareaFieldComponent } from '../core/components/text-area-field/text-area-field.component';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    component: CheckoutPage
  }
];

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ModalsModule,
    NgSelectModule
  ],
  declarations: [CheckoutPage, AddressFormComponent, StringFieldComponent, TextareaFieldComponent],
  entryComponents: [AddressFormComponent, StringFieldComponent, TextareaFieldComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class CheckoutPageModule {}
