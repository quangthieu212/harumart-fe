import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AccountsettingsPage } from './accountsettings.page';

const routes: Routes = [
  {
    path: '',
    component: AccountsettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AccountsettingsPage]
})
export class AccountsettingsPageModule {}
