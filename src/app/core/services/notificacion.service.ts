import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Notificacion } from '../models';

@Injectable()
export class NotificacionService {
    constructor(
        private http: HttpClient
    ) { }

    create(notificacion: Notificacion): Observable<any> {
        return this.http.post('/api/notificacion/create', {
            notificacion
        }).pipe(
            map(
                (data: any) => {
                    if(data.notificacion)
                        return data.notificacion;
                    
                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    get(filters?: any): Observable<any> {
        return this.http.post('/api/notificacion/get', {
            filters
        }).pipe(
            map(
                (data: any) => {
                    if(data.notificacions)
                        return data.notificacions;
                    
                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
    
    update(notificacion: Notificacion): Observable<any> {
        return this.http.post('/api/notificacion/update', {
            notificacion
        }).pipe(
            map(
                (data: any) => {
                    if(data.notificacion)
                        return data.notificacion;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    remove(notificacion: Notificacion): Observable<any> {
        return this.http.post('/api/notificacion/remove', {
            notificacion
        }).pipe(
            map(
                (data: any) => {
                    if(data.notificacion) {
                        return data.notificacion;
                    }

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
}
