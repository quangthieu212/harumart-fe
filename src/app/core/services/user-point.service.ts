import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class UserPointService {
    constructor(
        private http: HttpClient,
    ) {}

    getTotalDiscount(start: string, end: string) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('start', start);
        httpParams = httpParams.append('end', end);
        return this.http.get(`${environment.apiUrl}/v1/Users/total-discount`, { params: httpParams });
    }
}
