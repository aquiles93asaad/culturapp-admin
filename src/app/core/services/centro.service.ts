import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Centro } from '../models';

@Injectable()
export class CentroService {
    constructor(
        private http: HttpClient
    ) { }

    create(centro: Centro): Observable<any> {
        return this.http.post('/api/centro/create', {
            centro
        }).pipe(
            map(
                (data: any) => {
                    if(data.centro)
                        return data.centro;
                    
                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    get(filters?: any): Observable<any> {
        return this.http.post('/api/centro/get', {
            filters
        }).pipe(
            map(
                (data: any) => {
                    if(data.centros)
                        return data.centros;
                    
                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
    
    update(centro: Centro): Observable<any> {
        return this.http.post('/api/centro/update', {
            centro
        }).pipe(
            map(
                (data: any) => {
                    if(data.centro)
                        return data.centro;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    remove(centro: Centro): Observable<any> {
        return this.http.post('/api/centro/remove', {
            centro
        }).pipe(
            map(
                (data: any) => {
                    if(data.centro) {
                        return data.centro;
                    }

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
}
