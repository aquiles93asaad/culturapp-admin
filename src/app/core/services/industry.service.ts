import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Industry } from '../models';

@Injectable()
export class IndustryService {

    constructor(
        private http: HttpClient
    ) { }

    create(industry: Industry): Observable<any> {
        return this.http.post('/api/industry/create', {
            industry
        }).pipe(
            map(
                (data: any) => {
                    if(data.industry)
                        return data.industry;
                    
                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    get(filters?: any): Observable<any> {
        return this.http.post('/api/industry/get', {
            filters
        }).pipe(
            map(
                (data: any) => {
                    if(data.industries)
                        return data.industries;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    update(industry: any): Observable<any> {
        return this.http.post('/api/industry/update', {
            industry
        }).pipe(
            map(
                (data: any) => {
                    if(data.industry)
                        return data.industry;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    // delete(proposal: any, opportunityId: string): Observable<any> {
    //     return this.http.post('/api/proposal/delete', {
    //         proposal,
    //         opportunityId
    //     }).pipe(
    //         map(
    //             (data: any) => {
    //                 if(data.proposal)
    //                     return data.proposal;

    //                 throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
    //             }
    //         )
    //     );
    // }
}
