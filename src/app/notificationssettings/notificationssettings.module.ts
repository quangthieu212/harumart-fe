
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NotificationssettingsPage } from './notificationssettings.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationssettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NotificationssettingsPage]
})
export class NotificationssettingsPageModule {}
