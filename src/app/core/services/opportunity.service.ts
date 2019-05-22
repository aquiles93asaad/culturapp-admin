import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Opportunity } from '../models';

@Injectable()
export class OpportunityService {

    constructor(
        private http: HttpClient
    ) { }

    create(opportunity: Opportunity): Observable<any> {
        return this.http.post('/api/opportunity/create', {
            opportunity
        }).pipe(
            map(
                (data: any) => {
                    if(data.opportunity)
                        return data.opportunity;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    get(filters?: any, onlyUserOpportunities?: boolean): Observable<any> {
        return this.http.post('/api/opportunity/get', {
            filters,
            onlyUserOpportunities
        }).pipe(
            map(
                (data: any) => {
                    if(data.opportunities)
                        return data.opportunities;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    update(opportunity: any): Observable<any> {
        return this.http.post('/api/opportunity/update', {
            opportunity
        }).pipe(
            map(
                (data: any) => {
                    if(data.opportunity)
                        return data.opportunity;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    remove(opportunity: any): Observable<any> {
        return this.http.post('/api/opportunity/remove', {
            opportunity
        }).pipe(
            map(
                (data: any) => {
                    if(data.opportunity)
                        return data.opportunity;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
}
