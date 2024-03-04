
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { IonicModule } from '@ionic/angular';
import { ProductdetailPage } from './productdetail.page';
import { ProductComponent } from '../product/product.component';
import { InnerhomeComponent } from '../innerhome/innerhome.component';
import { ReviewComponent } from '../review/review.component';
import { ComponentsModule } from '../core/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: ProductdetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  providers: [
    SocialSharing],
  declarations: [ProductdetailPage, ProductComponent, InnerhomeComponent, ReviewComponent],
  entryComponents: [ProductComponent, InnerhomeComponent, ReviewComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ProductdetailPageModule { }
