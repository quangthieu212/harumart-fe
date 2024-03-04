import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { IonicCoreService } from 'src/app/core/services/ionic-core.service';
import { Customer } from '../core/models/Customer';
import { CustomerService } from '../core/services/customer.service';

const USER_DETAIL = 'user-detail';
const PHONE_NUMBER = 'phone-number';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.page.html',
  styleUrls: ['./account-edit.page.scss'],
})
export class AccountEditPage implements OnInit {

  isLoading = false;
  form: FormGroup;
  customer: Customer;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  validation_messages = {
    displayName: [
      { type: 'required', message: 'Họ và tên là bắt buộc.' }
    ],
    email: [
      { type: 'pattern', message: 'Email không đúng.' }
    ]
  };

  constructor(
    private storage: Storage,
    public formBuilder: FormBuilder,
    private customerService: CustomerService,
    private ionicCoreService: IonicCoreService
  ) { }

  async ngOnInit() {

  }

  async ionViewWillEnter() {
    this.isLoading = true;
    const phone = await this.storage.get(PHONE_NUMBER);
    this.customerService.getCustomerByPhone(phone).subscribe((res: any) => {
      this.customer = res.data;
      if (res.data?.additionalInfo) {
        this.customer.gender = res.data.additionalInfo;
      }
      if (res.data?.phoneSanitized) {
        this.customer.nationalId = res.data.phoneSanitized;
      }
      this.isLoading = false;
      this.initForm();
    }, e => {
      this.isLoading = false;
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      displayName: new FormControl(this.customer.name, Validators.required),
      email: new FormControl(this.customer.email, Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      nationalId: new FormControl(this.customer.nationalId),
      gender: new FormControl(this.customer.gender),
      phone: new FormControl(this.customer.phone),
    });
  }

  onSubmitUpdate(value) {
    this.isLoading = true;
    this.customerService.createAddress(value).subscribe((res: any) => {
      this.customer = res.data;
      if (res.data?.additionalInfo) {
        this.customer.gender = res.data.additionalInfo;
      }
      if (res.data?.phoneSanitized) {
        this.customer.nationalId = res.data.phoneSanitized;
      }
      this.isLoading = false;
      this.ionicCoreService.showToastSuccess({message: 'Cập nhật thành công.'});
    }, (e) => {
      this.isLoading = false;
    });
  }

}
