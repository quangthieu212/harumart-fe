
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ManagepaymentsPage } from './managepayments.page';

const routes: Routes = [
  {
    path: '',
    component: ManagepaymentsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ManagepaymentsPage]
})
export class ManagepaymentsPageModule {}
