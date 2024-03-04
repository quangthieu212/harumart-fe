import { NgModule }                         from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { DistrictsSearchPage }              from './districts-search/districts-search.page';
import { WardsSearchPage }                  from './wards-search/wards-search.page';
import { ProvinceSearchPage }               from './province-search/province-search.page';
import { IonicModule }                      from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalSearchBaseComponent }         from './modal-search-base/modal-search-base.component';


@NgModule({
    declarations: [
        ProvinceSearchPage,
        DistrictsSearchPage,
        WardsSearchPage,
        ModalSearchBaseComponent
    ],
    exports: [
        ProvinceSearchPage,
    ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule
    ],
    entryComponents: [
        ProvinceSearchPage,
        DistrictsSearchPage,
        WardsSearchPage
    ],
})
export class ModalsModule {
}
