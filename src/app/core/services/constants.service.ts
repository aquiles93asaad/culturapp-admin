import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Constants } from '../models';

@Injectable()
export class ConstantsService {

    constructor(
        private http: HttpClient
    ) { }

    check(): Observable<any> {
        return this.http.get('/api/constants/check').pipe(
            map(
                (data: any) => {
                    if(typeof data.isThereActiveConstants !== 'undefined')
                        return data.isThereActiveConstants;
                    
                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    create(constants: Constants): Observable<any> {
        return this.http.post('/api/constants/create', {
            constants
        }).pipe(
            map(
                (data: any) => {
                    if(data.constants)
                        return data.constants;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    get(filters?: any): Observable<any> {
        return this.http.post('/api/constants/get', {
            filters
        }).pipe(
            map(
                (data: any) => {
                    if(data.constants)
                        return data.constants;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    update(constants: any): Observable<any> {
        return this.http.post('/api/constants/update', {
            constants
        }).pipe(
            map(
                (data: any) => {
                    if(data.constants)
                        return data.constants;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
}
