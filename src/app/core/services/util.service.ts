import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    constructor() {}

    convertTimeToDateTime(time: number): string {
        if (!time) {
            return;
        }
        const date = new Date(time*1000);

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const today = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const second = date.getSeconds();

        return today + '/' + month + '/' + year + ' - ' + hours + ':' + minutes + ':' + second;

    }

    convertStringToDateTime(dateStr: Date): string {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const today = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const second = date.getSeconds();

        return today + '/' + month + '/' + year + ' - ' + hours + ':' + minutes + ':' + second;

    }

    convertStringToDate(dateStr: Date): string {
        if (dateStr == null) {
            return '';
        }
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const today = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const second = date.getSeconds();

        return today + '/' + month + '/' + year;

    }
}
