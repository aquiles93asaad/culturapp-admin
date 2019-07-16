import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models';

@Injectable()
export class UserService {
    constructor(
        private http: HttpClient
    ) { }

    check(email: string, dni?: string): Observable<any> {
        return this.http.post('/api/user/check', {
            email,
            dni
        }).pipe(
            map(
                (data: any) => {
                    if(typeof data.userExists !== 'undefined')
                        return data.userExists;
                    
                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    create(user: User): Observable<any> {
        return this.http.post('/api/user/create', {
            user
        }).pipe(
            map(
                (data: any) => {
                    if(data.user)
                        return data.user;
                    
                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    get(filters?: any): Observable<any> {
        return this.http.post('/api/user/get', {
            filters
        }).pipe(
            map(
                (data: any) => {
                    if(data.users)
                        return data.users;
                    
                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
    
    update(user: User): Observable<any> {
        return this.http.post('/api/user/update', {
            user
        }).pipe(
            map(
                (data: any) => {
                    if(data.user)
                        return data.user;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    remove(user: User): Observable<any> {
        return this.http.post('/api/user/remove', {
            user
        }).pipe(
            map(
                (data: any) => {
                    if(data.user) {
                        return data.user;
                    }

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    // createProfesor(user: User): Observable<any> {
    //     return this.http.post('/api/user/createProfesor', {
    //         user
    //     }).pipe(
    //         map(
    //             (data: any) => {
    //                 if(data.user)
    //                     return data.user;
                    
    //                 throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
    //             }
    //         )
    //     );
    // }
}
