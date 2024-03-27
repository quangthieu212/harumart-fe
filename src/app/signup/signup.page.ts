import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { MenuController, ModalController } from '@ionic/angular';
import { InfomodalPage } from '../infomodal/infomodal.page';
import { DataService } from '../data.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { PasswordValidator } from '../core/validators/password.validator';
import { phoneNumberValidator } from '../core/validators';
import { ActivatedRoute } from '@angular/router';
import { IonicCoreService } from '../core/services/ionic-core.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  form: FormGroup;
  matchingPasswords: FormGroup;
  phoneNumber: string;
  phoneParent: string;
  isLoading = false;

  typeOptions = [
    {
      code: 'CTV',
      name: 'Cộng tác viên'
    },
    {
      code: 'DAI_LY',
      name: 'Đại lý'
    }
  ];

  validationMessages = {
    name: [
      { type: 'required', message: 'Họ và tên là bắt buộc.' }
    ],
    phone: [
      { type: 'required', message: 'Số điện thoại là bắt buộc.' },
      { type: 'invalidPhone', message: 'Số điện thoại không hợp lệ.' }
    ],
    phoneParent: [
      { type: 'invalidPhone', message: 'Số điện thoại người giới thiệu không hợp lệ.' }
    ],
    password: [
      { type: 'required', message: 'Mật khẩu là bắt buộc.' },
      { type: 'minlength', message: 'Mật khẩu phải có ít nhất 5 ký tự.' },
      // { type: 'pattern', message: 'Your password must contain uppercase, lowercase, special chars and number.' }
    ],
    confirmPassword: [
      { type: 'required', message: 'Xác nhận mật khẩu là bắt buộc.' }
    ],
    matchingPasswords: [
      { type: 'areEqual', message: 'Mật khẩu không khớp.' }
    ]
  };

  constructor(
    public fun: FunctionsService,
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private data: DataService,
    public formBuilder: FormBuilder,
    private auth: AuthService,
    public activatedRoute: ActivatedRoute,
    private ionicCoreService: IonicCoreService
    ) {
      this.activatedRoute.queryParams.subscribe(async (res)=> {
        if (res.gotoAddPoint) {
          this.phoneNumber = await this.auth.getPhoneNumber();
        }
      });
    }

  ngOnInit() {
    this.initForm();
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  initForm() {
    this.matchingPasswords = new FormGroup({
      password: new FormControl('', {validators: Validators.compose([
        Validators.minLength(5),
        Validators.required,
        // Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9!$%@#£€*?&]+$')
      ]), updateOn: 'blur'}),
      confirmPassword: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => PasswordValidator.areEqual(formGroup));

    this.form = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      // email: new FormControl('', Validators.compose([
      //   Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      // ])),
      phone: new FormControl(this.phoneNumber || '', {
        validators: [
          Validators.required,
          phoneNumberValidator
        ],
        updateOn: 'blur'
      }),
      phoneParent: new FormControl(this.phoneParent || '', {
        validators: [
          phoneNumberValidator
        ],
        updateOn: 'blur'
      }),
      address: new FormControl(''),
      accountNumber: new FormControl(''),
      matchingPasswords: this.matchingPasswords,
      type: new FormControl('')
    });
  }

  // signup(){
  //   if(this.first_name != '' && this.last_name != '' && this.email != '' && this.password != '' && this.fun.validateEmail(this.email)){
  //     this.fun.navigate('home',false);
  //   }
  //   else {
  //     this.fun.presentToast('Wrong Input', true, 'bottom', 2100);
  //   }
  // }

  async signup(values) {
    this.isLoading = true;
    const body = {
      phoneNumber: values.phone,
      phoneParent: values.phoneParent,
      adress: values.address,
      account_Number: values.accountNumber,
      displayName: `${values.firstName} ${values.lastName}`,
      password: values.matchingPasswords.password,
      type: values.type
    };
    this.auth.register(body).subscribe(async (res) => {
			this.isLoading = false;
			// this.navCtrl.navigateRoot(ROUTES.LOGIN, { animationDirection: 'forward' });
      this.fun.navigateWithQuery('login', {
        value : values.phone,
       });
      await this.ionicCoreService.showToastSuccess({message: 'Tạo tài khoản thành công.'});
		},
    async (error) => {
      this.isLoading = false;
      const messagee = error?.error?.Message;
      await this.ionicCoreService.showToastError({message: messagee || 'Tạo tài khoản thất bại.'});
    });
  }

  async openModal(b) {
    let modal;
    if(b){
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: { value: this.data.terms_of_use, title: 'Terms of Use' }
      });
    }
    else{
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: { value: this.data.privacy_policy, title: 'Privacy Policy' }
      });
    }
    return await modal.present();
  }

  onChangeType() {

  }


}
