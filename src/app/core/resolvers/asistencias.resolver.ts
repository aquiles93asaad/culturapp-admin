import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Asistencia } from '../models';
import { AsistenciaService } from '../services';

@Injectable()
export class AsistenciasResolver implements Resolve<Asistencia[]> {

    constructor(
        private asistenciaService: AsistenciaService
    ) { }

    resolve(): Observable<Asistencia[]> {
        return this.asistenciaService.get();
    }
}