import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { OpportunityDemo } from '../models';

@Injectable()
export class OpportunityDemoService {

    constructor(
        private http: HttpClient
    ) { }

    create(demo: OpportunityDemo, opportunityId: string): Observable<any> {
        return this.http.post('/api/demo/create', {
            demo,
            opportunityId
        }).pipe(
            map(
                (data: any) => {
                    if(data.demo)
                        return data.demo;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    update(demo: any): Observable<any> {
        return this.http.post('/api/demo/update', {
            demo
        }).pipe(
            map(
                (data: any) => {
                    if(data.demo)
                        return data.demo;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
}
