import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { phoneNumberValidator } from '../core/validators';
import { AuthService } from '../core/services/auth.service';
import { IonicCoreService } from '../core/services/ionic-core.service';
import { FunctionsService } from '../functions.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  form: FormGroup;
  isLoading = false;

  constructor(
    public formBuilder: FormBuilder,
    private auth: AuthService,
    private ionicCoreService: IonicCoreService,
    public fun: FunctionsService,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      phoneNumber: new FormControl('', {
        validators: [
          Validators.required,
          phoneNumberValidator
        ],
        updateOn: 'change'
      }),
      key: new FormControl('', {
        validators: [
          Validators.required
        ],
        updateOn: 'change'
      })
    });
  }

  forgotPwd(value) {
    this.isLoading = true;
    this.auth.changePwd(value.phoneNumber, value.key).subscribe(async (res) => {
      this.isLoading = false;
      this.ionicCoreService.showToastSuccess({ message: 'Reset password success', duration: 3000 });
      this.fun.navigate('login', false);
		},
    (e) => {
      const message = e?.error?.Message;
      this.ionicCoreService.showToastError({ message, duration: 3000 });
      this.isLoading = false;
    });
  }

}
