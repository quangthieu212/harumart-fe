import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(
        private http: HttpClient,
    ) {}

    createOrder(data) {
        return this.http.post(`${environment.apiUrl}/v1/Orders`, data);
    }

    getOrdersByUser(filter) {
        return this.http.post(`${environment.apiUrl}/v1/Orders/find-by-user`, filter);
    }

    getShippingAmount() {}
}
