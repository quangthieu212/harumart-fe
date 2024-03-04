import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ProductlistPage } from '../productlist/productlist.page';
import { ProductMainPage } from './productmain.page';
import { ProductlistPageModule } from '../productlist/productlist.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProductMainPage
      }
    ]),
    ProductlistPageModule
  ],
  declarations: [ProductMainPage
  ],
  entryComponents: []
})
export class ProductMainPagePageModule {}
