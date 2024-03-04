import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


const PATH_LOCALS = 'assets/locals';
const PROVINCES_PATH = PATH_LOCALS + '/new_provinces.json';
const DISTRICTS_PATH = PATH_LOCALS + '/new_districts.json';
const WARDS_PATH = PATH_LOCALS + '/new_wards.json';

export interface CommonLocation {
    id: string;
    name: string;
    code: string;
}


@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    constructor(
        private http: HttpClient
    ) {
    }

    getProvices(): Observable<CommonLocation[]> {
        return this.http.get<CommonLocation[]>(PROVINCES_PATH);
    }

    getDistrictsByProvice(provinceId: string): Observable<CommonLocation[]> {
        return this.http.get(DISTRICTS_PATH).pipe(
            map(districts => districts[provinceId] || [])
        );
    }

    getWardByDistricts(districtsId: string): Observable<CommonLocation[]> {
        return this.http.get(WARDS_PATH).pipe(
            map(wards => wards[districtsId] || [])
        );
    }

}
