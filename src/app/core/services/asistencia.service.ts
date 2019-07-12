import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Asistencia } from '../models';

@Injectable()
export class AsistenciaService {
    constructor(
        private http: HttpClient
    ) { }

    create(asistencia: Asistencia): Observable<any> {
        return this.http.post('/api/asistencia/create', {
            asistencia
        }).pipe(
            map(
                (data: any) => {
                    if(data.asistencia)
                        return data.asistencia;
                    
                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    get(filters?: any): Observable<any> {
        return this.http.post('/api/asistencia/get', {
            filters
        }).pipe(
            map(
                (data: any) => {
                    if(data.asistencias)
                        return data.asistencias;
                    
                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
    
    update(asistencia: Asistencia): Observable<any> {
        return this.http.post('/api/asistencia/update', {
            asistencia
        }).pipe(
            map(
                (data: any) => {
                    if(data.asistencia)
                        return data.asistencia;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    remove(asistencia: Asistencia): Observable<any> {
        return this.http.post('/api/asistencia/remove', {
            asistencia
        }).pipe(
            map(
                (data: any) => {
                    if(data.asistencia) {
                        return data.asistencia;
                    }

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
}
