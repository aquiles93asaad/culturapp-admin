import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Materia } from '../models';
import { MateriaService } from '../services';

@Injectable()
export class MateriasResolver implements Resolve<Materia[]> {

    constructor(
        private materiaService: MateriaService
    ) { }

    resolve(): Observable<Materia[]> {
        return this.materiaService.get();
    }
}