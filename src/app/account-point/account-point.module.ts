import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountPointPageRoutingModule } from './account-point-routing.module';

import { AccountPointPage } from './account-point.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountPointPageRoutingModule
  ],
  declarations: [AccountPointPage]
})
export class AccountPointPageModule {}
