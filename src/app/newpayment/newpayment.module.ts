import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NewpaymentPage } from './newpayment.page';

const routes: Routes = [
  {
    path: '',
    component: NewpaymentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NewpaymentPage]
})
export class NewpaymentPageModule {}
