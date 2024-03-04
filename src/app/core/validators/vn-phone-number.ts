import { AbstractControl } from '@angular/forms';
import { isValidPhoneNumber } from '../utils/phone-number';

export const phoneNumberValidator = (c: AbstractControl): { [key: string]: boolean } | null => c.value === '' ?
        null :
        !isValidPhoneNumber(c.value) ? { invalidPhone: true } : null;

