import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Curso } from '../models';

@Injectable()
export class CursoService {
    constructor(
        private http: HttpClient
    ) { }

    create(curso: Curso): Observable<any> {
        return this.http.post('/api/curso/create', {
            curso
        }).pipe(
            map(
                (data: any) => {
                    if(data.curso)
                        return data.curso;
                    
                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    get(filters?: any): Observable<any> {
        return this.http.post('/api/curso/get', {
            filters
        }).pipe(
            map(
                (data: any) => {
                    if(data.cursos)
                        return data.cursos;
                    
                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
    
    update(curso: Curso): Observable<any> {
        return this.http.post('/api/curso/update', {
            curso
        }).pipe(
            map(
                (data: any) => {
                    if(data.curso)
                        return data.curso;

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }

    remove(curso: Curso): Observable<any> {
        return this.http.post('/api/curso/remove', {
            curso
        }).pipe(
            map(
                (data: any) => {
                    if(data.curso) {
                        return data.curso;
                    }

                    throw new HttpErrorResponse({ status: 401, statusText: data.errorMessage, error: data.errorType });
                }
            )
        );
    }
}
