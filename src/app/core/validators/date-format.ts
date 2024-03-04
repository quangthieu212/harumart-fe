import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';
export const dateFormatValidator = (format = 'DD/MM/YYYY') => {
    return (c: AbstractControl) => {
        if (c.value.length < format.length) {
            return { invalid: true };
        } else {
            return moment(new Date(c.value), format, true).isValid() ? null : { invalid: true };
        }
    };
};
