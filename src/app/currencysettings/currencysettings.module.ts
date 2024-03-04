
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CurrencysettingsPage } from './currencysettings.page';

const routes: Routes = [
  {
    path: '',
    component: CurrencysettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CurrencysettingsPage]
})
export class CurrencysettingsPageModule {}
