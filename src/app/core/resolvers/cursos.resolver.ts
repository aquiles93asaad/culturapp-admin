import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Curso } from '../models';
import { CursoService } from '../services';

@Injectable()
export class CursosResolver implements Resolve<Curso[]> {

    constructor(
        private cursoService: CursoService
    ) { }

    resolve(): Observable<Curso[]> {
        return this.cursoService.get();
    }
}