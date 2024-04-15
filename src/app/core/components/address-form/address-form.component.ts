import { Component, OnInit, forwardRef, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { isString, isEmpty} from 'lodash';
import { DistrictsSearchPage } from '../../modals/districts-search/districts-search.page';
import { ProvinceSearchPage } from '../../modals/province-search/province-search.page';
import { WardsSearchPage } from '../../modals/wards-search/wards-search.page';

export const ADDRESS_FIELDS: Array<{ name: string; id: string, default?: string, isAddress?: boolean, require?: boolean }> = [
  // { name: 'Tên', id: 'name'},
  // { name: 'Số điện thoại', id: 'phone'},
  { name: 'Tỉnh / thành', id: 'province', isAddress: true },
  { name: 'Quận / Huyện', id: 'district', isAddress: true },
  { name: 'Xã / Phường', id: 'ward', isAddress: true },
  { name: 'Số nhà / ngõ / xóm', id: 'street2' },
];


// eslint-disable-next-line @typescript-eslint/naming-convention
export const AddressFormValidators = (formKeys: Array<string> = null) => ({
  required: (c: AbstractControl): { [key: string]: any } | null => (formKeys || ADDRESS_FIELDS.map((item) => item.id)).filter(
      (key) => (!isString(c.value?.[key]) && !c.value?.[key]?.id) || c.value?.[key]?.length <= 1
    ).length > 0
      ? { invalid: true }
      : null,
});

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressFormComponent),
      multi: true,
    },
  ],
})
export class AddressFormComponent implements OnInit, ControlValueAccessor {
  @Input() showName: boolean;
  form: FormGroup;
  fields = ADDRESS_FIELDS;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController
    ) {}

  ngOnInit() {
    this.initForm();
    console.log('FORM: ', this.form.value);
  }

  writeValue(obj: any) {
    if (obj === null) {
      this.form.reset();
    };
    this.form.patchValue(obj);
  }

  registerOnChange(fn: any) {
    this.form.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any) {}

  initForm() {
    const form = {};
    for ( const field of this.fields) {
      if (field.isAddress) {
        form[field.id] = this.fb.group({
          name: this.fb.control('', [Validators.required]),
          id: this.fb.control('', [Validators.required]),
          code: this.fb.control('', [Validators.required])
        });
      } else {
        form[field.id] = this.fb.control(field.default || '', field.require ? [Validators.required] : []);
      }

    }
    console.log('noteForm: ', form);
    this.form = this.fb.group(form);
  }

  compareFn = (o1: any, o2: any) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  async onClickSelectProvince() {
    console.log('async onClickSelectProvince');
    const modal = await this.modalCtrl.create({
        component: ProvinceSearchPage,
        mode: 'ios'
    });
    modal.present();
    modal.onWillDismiss().then(data => {
        const province = data.data;
        if (province) {
            this.form.get('district').reset();
            this.form.get('ward').reset();
            this.form.get('province').patchValue(province);
        }
    });
}

async onClickSelectDistrict() {
    const hasProvince = this.form.get('province.id').valid;
    if (!hasProvince) {
        return;
    }
    const provinceId = this.form.get('province').get('id').value;
    const modal = await this.modalCtrl.create({
        component: DistrictsSearchPage,
        mode: 'ios',
        componentProps: {
            provinceId
        }
    });
    modal.present();
    modal.onWillDismiss().then(data => {
        console.log('onClickSelectDistrict', data);
        const district = data.data;
        if (district) {
            this.form.get('ward').reset();
            this.form.get('district').patchValue(district);
        }
    });
}

async onClickWard() {
    const hasDistrict = this.form.get('district.id').valid;
    if (!hasDistrict) {
        return;
    }
    const districtId = this.form.get('district').get('id').value;
    const modal = await this.modalCtrl.create({
        component: WardsSearchPage,
        mode: 'ios',
        componentProps: {
            districtId
        }
    });
    modal.present();
    modal.onWillDismiss().then(data => {
        console.log('onClickWard', data);
        const ward = data.data;
        if (ward) {
            this.form.get('ward').patchValue(ward);
        }
    });
}
}
