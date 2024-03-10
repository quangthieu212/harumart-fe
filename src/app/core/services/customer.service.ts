import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PartnerRequest } from '../models/Customer';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    constructor(
        private http: HttpClient,
    ) {}

    searchCustomer(filter) {
        return this.http.post(`${environment.apiUrl}/v1/Users/listCustomer`, filter);
    }

    createAddress(data: PartnerRequest) {
        return this.http.post(`${environment.apiUrl}/v1/Partner/create-address`, data);
    }

    getCustomerByPhone(phone: string) {
        return this.http.get(`${environment.apiUrl}/v1/Partner/find-by-phone/${phone}`);
    }
}
