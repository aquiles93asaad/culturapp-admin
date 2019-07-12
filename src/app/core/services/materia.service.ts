import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Materia } from '../models';

@Injectable()
export class MateriaService {
    constructor(
        private http: HttpClient
    ) { }

    create(materia: Materia): Observable<any> {
        return this.http.post('/api/materia/create', {
            materia
        }).pipe(
            map(
                (data: any) => {
                    if(data.materia)
                        return data.materia;
                    
                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    get(filters?: any): Observable<any> {
        return this.http.post('/api/materia/get', {
            filters
        }).pipe(
            map(
                (data: any) => {
                    if(data.materias)
                        return data.materias;
                    
                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
    
    update(materia: Materia): Observable<any> {
        return this.http.post('/api/materia/update', {
            materia
        }).pipe(
            map(
                (data: any) => {
                    if(data.materia)
                        return data.materia;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    remove(materia: Materia): Observable<any> {
        return this.http.post('/api/materia/remove', {
            materia
        }).pipe(
            map(
                (data: any) => {
                    if(data.materia) {
                        return data.materia;
                    }

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
}
