import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommissionRequest } from '../models/Commission';
import { ProductSearchFilter } from '../models/Product';


@Injectable({
    providedIn: 'root'
})
export class CommissionService {

    constructor(
        private http: HttpClient,
    ) {}

    getCommissionByUserId(request: CommissionRequest) {
        return this.http.post(`${environment.apiUrl}/Salary`, request );
    }
}
