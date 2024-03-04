import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProvinceSearchPage } from './province-search.page';

const routes: Routes = [
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProvinceSearchPageRoutingModule {}
