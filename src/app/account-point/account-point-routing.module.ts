import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountPointPage } from './account-point.page';

const routes: Routes = [
  {
    path: '',
    component: AccountPointPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountPointPageRoutingModule {}
