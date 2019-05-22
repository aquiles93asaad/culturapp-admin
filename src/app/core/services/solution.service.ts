import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Solution } from '../models';

@Injectable()
export class SolutionService {
    
    constructor(
        private http: HttpClient
    ) { }

    create(solution: Solution): Observable<any> {
        return this.http.post('/api/solution/create', {
            solution
        }).pipe(
            map(
                (data: any) => {
                    if(data.solution) {
                        return data.solution;
                    }

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    get(filters?: any): Observable<any>{
        return this.http.post('/api/solution/get', {
            filters
        }).pipe(
            map(
                (data: any) => {
                    if(data.solutions) {
                        return data.solutions;
                    }
                    
                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
    
    update(solution: Solution): Observable<any> {
        return this.http.post('/api/solution/update', {
            solution
        }).pipe(
            map(
                (data: any) => {
                    if(data.solution) {
                        return data.solution;
                    }

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
}
