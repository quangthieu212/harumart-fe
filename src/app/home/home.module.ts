import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HomePage } from './home.page';
import { ProductlistPage } from '../productlist/productlist.page';
import { ComponentsModule } from '../core/components/components.module';
import { ProductlistPageModule } from '../productlist/productlist.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    ComponentsModule,
    ProductlistPageModule
  ],
  declarations: [HomePage],
  entryComponents: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class HomePageModule {}
