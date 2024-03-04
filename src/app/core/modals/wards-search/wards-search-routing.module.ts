import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WardsSearchPage } from './wards-search.page';

const routes: Routes = [
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WardsSearchPageRoutingModule {}
