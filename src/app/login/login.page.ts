import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { InfomodalPage } from '../infomodal/infomodal.page';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { phoneNumberValidator } from '../core/validators';
import { AuthService } from '../core/services/auth.service';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { IonicCoreService } from '../core/services/ionic-core.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;

  phoneNumber = '';
  password = '';
  isLoading = false;

  validationMessages = {
    phoneNumber: [
      { type: 'required', message: 'Số điện thoại là bắt buộc.' },
      { type: 'invalidPhone', message: 'Số điện thoại không hợp lệ.' }
    ],
    password: [
      { type: 'required', message: 'Mật khẩu là bắt buộc.' },
      { type: 'minlength', message: 'Mật khẩu ít nhất là 5 ký tự.' },
      { type: 'pattern', message: 'Mật khẩu của bạn phải chứa chữ hoa, chữ thường, ký tự đặc biệt và số.' }
    ],
  };

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    public fun: FunctionsService,
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private auth: AuthService,
    private data: DataService,
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    private ionicCoreService: IonicCoreService
    ) {
      this.activatedRoute.queryParams.subscribe((res)=> {
        if(res.value) {
          this.phoneNumber = res.value;
        }
      });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      phoneNumber: new FormControl(this.phoneNumber || '', {
        validators: [
          Validators.required,
          phoneNumberValidator
        ],
        updateOn: 'blur'
      }),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        // Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9!$%@#£€*?&]+$')
      ]))
    });
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
    this.splashScreen.hide();
  }

  // signin() {
  //   this.platform.ready().then(() => {
  //     if (this.platform.is('cordova')) {
  //       if (this.fun.validateEmail(this.email) && this.password !== '') {
  //         this.fun.navigate('home', false);
  //       } else {
  //         this.fun.presentToast('Wrong Input!', true, 'bottom', 2100);
  //       }
  //     } else {
  //       this.fun.navigate('home', false);
  //     }
  //   });

  // }

  signin(userData) {
    this.isLoading = true;
    this.auth.login(userData.phoneNumber, userData.password).subscribe(async (res) => {
      this.isLoading = false;
      this.fun.navigate('home', false);
		},
    (e) => {
      const message = e?.error?.Message;
      this.ionicCoreService.showToastError({ message, duration: 3000 });
      this.isLoading = false;
    });
  }

  async openModal(b) {
    let modal;
    if (b) {
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: { value: this.data.terms_of_use, title: 'Điều khoản sử dụng' }
      });
    } else {
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: { value: this.data.privacy_policy, title: 'Chính sách bảo mật' }
      });
    }
    return await modal.present();
  }

}
