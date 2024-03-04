import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class MobileUtilsService {
  constructor(
    private platform: Platform, //
  ) {}

  isMobile() {
    return this.platform.is('capacitor') && (this.platform.is('ios') || this.platform.is('android'));
  }

  isAndroid() {
    return this.isMobile() && this.platform.is('android');
  }

  isIOS() {
    return this.isMobile() && this.platform.is('ios');
  }

  convertHtmlSpecialSymbolsToUnicode(str: string) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.innerText;
}
}
