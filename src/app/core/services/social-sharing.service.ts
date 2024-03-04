import { Injectable } from '@angular/core';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { MobileUtilsService } from './mobile-utils.service';

@Injectable({
  providedIn: 'root'
})
export class SocialSharingService {
  constructor(
    private socialSharing: SocialSharing,
    private mobileUtilsService: MobileUtilsService
  ) { }

  shareText(subject: string, message: string) {
    return this.socialSharing.shareWithOptions({
      subject,
      message,
      chooserTitle: subject,
    });
  }

  // Use existing HTMLImageElements instead of downloading again
  async shareImgs(imgSrcs: string[], imgElements: HTMLImageElement[]) {
    // On iOS, can share image's url directly without any issues (even without file extension, file url has spaces)
    // if (this.mobileUtilsService.isIOS()) {
    //   console.log('social share ios')
    //   return this.socialSharing.shareWithOptions({
    //     files: imgSrcs,
    //   });
    // } else if (this.mobileUtilsService.isAndroid()) {
      // On android, can share only image's url with file extension and file url must not have spaces. Maybe problem with the lib itself
      // const base64Imgs: string[] = [];
      // for (const imgElement of imgElements) {
      //   if(!imgElement.complete){
      //       // make sure that the image is fully loaded before drawing to canvas
      //       await new Promise((resolve, reject) => {
      //           imgElement.onload = () => {
      //               resolve(imgElement);
      //           };
      //           imgElement.onerror = () => {
      //               reject(null);
      //           };
      //       });
      //   }
      //   const canvas = document.createElement('canvas');
      //   // Determine new ratio based on max size
      //   let ratio = 1;
      //   const quality = 0.8;
      //   const maxWidth = 600;
      //   const maxHeight = 600;
      //   imgElement.crossOrigin = 'anonymous';
      //   if (imgElement.naturalWidth > maxWidth) {
      //       ratio = maxWidth / imgElement.naturalWidth;
      //   } else if (imgElement.naturalHeight > maxHeight) {
      //       ratio = maxHeight / imgElement.naturalHeight;
      //   }

      //   canvas.width = imgElement.naturalWidth * ratio;
      //   canvas.height = imgElement.naturalHeight * ratio;
      //   const ctx = canvas.getContext('2d');
      //   ctx.drawImage(imgElement, 0, 0, imgElement.naturalWidth, imgElement.naturalHeight, 0, 0, canvas.width, canvas.height);
      //   const dataURL = canvas.toDataURL('image/jpeg', quality);
      //   // window.alert(dataURL)
      //   base64Imgs.push(dataURL);

      // }

      // return this.socialSharing.shareWithOptions({
      //   files: base64Imgs,
      // });
    // } else {
    //   return Promise.reject('Platform is not supported')
    // }
  }

  async shareBase64Imgs(base64Imgs: string[], imgElements: HTMLImageElement[]) {
    return this.socialSharing.shareWithOptions({
      files: base64Imgs,
    });
  }
}
