import { HttpClient, HttpParams } from '@angular/common/http';
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

    getShippingFee(params: any) {
        const {address, phone, name, shipPartner, shipType, wareHouseId, productTmpIds} = params;
        let httpParams = new HttpParams();
        if (address) {
            httpParams = httpParams.append('street', `${address.province.name}, ${address.district.name}, ${address.ward.name}`);
            httpParams = httpParams.append('street2', address.street2);
            httpParams = httpParams.append('city', 'HN');
            httpParams = httpParams.append('phone', phone);
            httpParams = httpParams.append('name', name);
            httpParams = httpParams.append('ship_partner', shipPartner);
            httpParams = httpParams.append('ship_type', shipType === 'fast' ? true : false);
            httpParams = httpParams.append('wareHouseId', wareHouseId);
            httpParams = httpParams.append('product_tmp_ids', productTmpIds);
        }
        return this.http.get(`${environment.apiUrl}/v1/Orders/get-ship-fee`, { params: httpParams });
    }
}
