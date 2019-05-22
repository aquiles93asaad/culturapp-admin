import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { OpportunityProposal } from '../models';

@Injectable()
export class OpportunityProposalService {

    constructor(
        private http: HttpClient
    ) { }

    create(proposal: OpportunityProposal, opportunityId: string): Observable<any> {
        return this.http.post('/api/proposal/create', {
            proposal,
            opportunityId
        }).pipe(
            map(
                (data: any) => {
                    if(data.proposal)
                        return data.proposal;
                    
                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    update(proposal: any, opportunityId: string): Observable<any> {
        return this.http.post('/api/proposal/update', {
            proposal,
            opportunityId
        }).pipe(
            map(
                (data: any) => {
                    if(data.proposal)
                        return data.proposal;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    remove(proposal: any, opportunityId: string): Observable<any> {
        return this.http.post('/api/proposal/remove', {
            proposal,
            opportunityId
        }).pipe(
            map(
                (data: any) => {
                    if(data.proposal)
                        return data.proposal;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    breakdown(proposal: OpportunityProposal): Observable<any> {
        return this.http.post('/api/proposal/breakdown', {
            proposal
        }).pipe(
            map(
                (data: any) => {
                    if(data.breakdown) {
                        return data.breakdown;
                    }

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
}
