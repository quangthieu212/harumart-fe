
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ProductlistPage } from './productlist.page';

const routes: Routes = [
  {
    path: '',
    component: ProductlistPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
    // RouterModule.forChild(routes)
  ],
  declarations: [ProductlistPage],
  providers: [],
  exports: [ProductlistPage]
})
export class ProductlistPageModule {}
