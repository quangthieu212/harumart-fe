import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { QuantityInputComponent } from './quantity-input/quantity-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderItemComponent } from './order-item/order-item.component';
import { DividerComponent } from './divider/divider.component';
import { DialogPrimaryComponent } from './dialog-primary/dialog-primary.component';
import { ProductShareModalComponent } from './product-share-modal/product-share-modal.component';
import { StateOrderModalComponent } from './state-order-modal/state-order-modal.component';

@NgModule({
  declarations: [
    SpinnerComponent,
    QuantityInputComponent,
    OrderItemComponent,
    DividerComponent,
    DialogPrimaryComponent,
    ProductShareModalComponent,
    StateOrderModalComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [
    SpinnerComponent,
    QuantityInputComponent,
    OrderItemComponent,
    DividerComponent,
    DialogPrimaryComponent,
    ProductShareModalComponent
  ],
  providers: [
    // ViCurrencyPipe,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ComponentsModule { }
