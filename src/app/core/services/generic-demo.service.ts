import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GenericDemo } from '../models';

@Injectable()
export class GenericDemoService {

    constructor(
        private http: HttpClient
    ) { }

    create(genericDemo: GenericDemo): Observable<any> {
        return this.http.post('/api/generic-demo/create', {
            genericDemo
        }).pipe(
            map(
                (data: any) => {
                    if(data.genericDemo)
                        return data.genericDemo;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    get(filters?: any): Observable<any> {
        return this.http.post('/api/generic-demo/get', {
            filters
        }).pipe(
            map(
                (data: any) => {
                    if(data.genericDemos)
                        return data.genericDemos;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    update(genericDemo: GenericDemo): Observable<any> {
        return this.http.post('/api/generic-demo/update', {
            genericDemo
        }).pipe(
            map(
                (data: any) => {
                    if(data.genericDemo)
                        return data.genericDemo;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
}
