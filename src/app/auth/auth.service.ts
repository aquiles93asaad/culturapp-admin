import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operators'

import { TokenStorage } from './token.storage';
import { User } from '../core/models';

@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient,
        private token: TokenStorage
    ) { }

    private userSourceSubject = new BehaviorSubject<User>(null);
    public userSource = this.userSourceSubject.asObservable();

    private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
    public isAuthenticated = this.isAuthenticatedSubject.asObservable();

    login(email: string, password: string, rememberMe?: boolean): Observable<any> {
        return this.http.post('/api/auth/login', {
            email,
            password
        }).pipe(
            map((data: any) => {
                if(data.user) {
                    this.setUser(data.user);
                    if(rememberMe) {
                        this.token.saveToken(data.token);
                    }
                    return data.user;
                }
                
                throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
            })
        )
    }

    register(user: User): Observable<any> {
        return Observable.create(observer => {
            this.http.post('/api/auth/register', {
                user
            }).subscribe((data: any) => {
                observer.next({ user: data.user });
                this.setUser(data.user);
                this.token.saveToken(data.token);
                observer.complete();
            })
        });
    }

    setUser(user): void {
        (user) ? this.isAuthenticatedSubject.next(true) : this.isAuthenticatedSubject.next(false);
        this.userSourceSubject.next(user);
        (<any>window).user = user;
    }

    me(): Observable<any> {
        return Observable.create(observer => {
            const tokenVal = this.token.getToken();
            if (!tokenVal) {
                this.isAuthenticatedSubject.next(false);
                return observer.complete();
            }
            this.http.get('/api/auth/me').subscribe((data: any) => {
                observer.next({ user: data.user });
                this.setUser(data.user);
                observer.complete();
            })
        });
    }

    signOut(): void {
        this.token.signOut();
        this.setUser(null);
        delete (<any>window).user;
    }
}
