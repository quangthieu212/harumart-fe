import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ProductSearchFilter } from '../models/Product';


@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(
        private http: HttpClient,
    ) {}

    getProductById(productId: string) {
        return this.http.get(`${environment.apiUrl}/Product/${productId}`, { });
    }

    searchProduct(searchValue, filter: ProductSearchFilter) {
        let httpParams = new HttpParams();
        if (searchValue) {
            httpParams = httpParams.append('searchValue', searchValue);
        }
        return this.http.post(`${environment.apiUrl}/Product/search`, filter, { params: httpParams });
    }
}
