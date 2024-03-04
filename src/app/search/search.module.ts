
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SearchPage } from './search.page';
import { ComponentsModule } from '../core/components/components.module';
import { ProductlistPage } from '../productlist/productlist.page';
import { ProductlistPageModule } from '../productlist/productlist.module';

const routes: Routes = [
  {
    path: '',
    component: SearchPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    ProductlistPageModule
  ],
  declarations: [SearchPage],
  entryComponents: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SearchPageModule {}
