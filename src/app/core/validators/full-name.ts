import { AbstractControl } from '@angular/forms';

export const isValidFullName = (fullName: string) => {
  return fullName ? fullName.split(' ').filter(s => s.length > 0).length >= 2 : false;
};
export const fullNameValidator = (c: AbstractControl): { [key: string]: boolean } | null => {
  return !isValidFullName(c.value) ? { invalidFullName: true } : null;
};

