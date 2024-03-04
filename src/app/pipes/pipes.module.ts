import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViCurrencyPipe } from './vi-currency.pipe';
import { SafePipe } from './safe.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ViCurrencyPipe,
    SafePipe
  ],
  providers: [
    ViCurrencyPipe,
    SafePipe
  ],
  exports: [
    ViCurrencyPipe,
    SafePipe
  ],
})
export class PipesModule {}
