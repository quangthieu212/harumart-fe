import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'viCurrency'
})
export class ViCurrencyPipe implements PipeTransform {
  constructor(
  ){

  }
  transform(value: any): any {
    return this.formatCurrency(value);
  }

  private formatCurrency(num): string {
    if (num === '' || num === null) {
      return '';
    }
    if (String(num).includes('.')) {
      num = String(num).replace(/[^[0-9]/g, '');
    }
    num = Number(num);
    if (isNaN(num)) {
      return '';
    }
    return Number(num)
      .toString()
      .split(/(?=(?:\d{3})+(?:,|$))/g)
      .join('.');
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  // formatNumber(num: string) {
  //   if (num === '' || num === null) {
  //     return '';
  //   }
  //   return this.maskPipe.transform(num,'separator',',');
  // }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  formatCurrencyInput(num: string | number): string {
    if (typeof num === 'number') {
      num = num.toString();
    }
    if (!num || num === '') {
      return '';
    }
    return num.replace(/[^[0-9]/g, '');
  }
}
