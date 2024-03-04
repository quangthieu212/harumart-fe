
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NotificationPage } from './notification.page';
import { ListPage } from '../list/list.page';
import { ListPageModule } from '../list/list.module';

const routes: Routes = [
  {
    path: '',
    component: NotificationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ListPageModule
  ],
  declarations: [NotificationPage],
  entryComponents: []
})
export class NotificationPageModule {}
