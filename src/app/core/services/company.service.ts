import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Company } from '../models';

@Injectable()
export class CompanyService {
    
    constructor(
        private http: HttpClient
    ) { }

    check(name: string, cuit:string): Observable<any> {
        return this.http.post('/api/company/check', {
            name,
            cuit
        }).pipe(
            map(
                (data: any) => {
                    if(typeof data.companyExists !== 'undefined')
                        return data.companyExists;
                        
                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    create(company: Company): Observable<any> {
        return this.http.post('/api/company/create', {
            company
        }).pipe(
            map(
                (data: any) => {
                    if(data.company) {
                        return data.company;
                    }

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    get(filters?: any):Observable<any>{
        return this.http.post('/api/company/get', {
            filters
        }).pipe(
            map(
                (data: any) => {
                    if(data.companies) {
                        return data.companies;
                    }

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    update(company: Company): Observable<any> {
        return this.http.post('/api/company/update', {
            company
        }).pipe(
            map(
                (data: any) => {
                    if(data.company) {
                        return data.company;
                    }

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    addSalesChannel(company: Company): Observable<any> {
        return this.http.post('/api/company/add-sales-channel', {
            company
        }).pipe(
            map(
                (data: any) => {
                    if(data.company) {
                        return data.company;
                    }

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    remove(company: Company): Observable<any> {
        return this.http.post('/api/company/remove', {
            company
        }).pipe(
            map(
                (data: any) => {
                    if(data.company) {
                        return data.company;
                    }

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
}
