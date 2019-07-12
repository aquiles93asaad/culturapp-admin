import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Centro } from '../models';
import { CentroService } from '../services';

@Injectable()
export class CentrosResolver implements Resolve<Centro[]> {

    constructor(
        private centroService: CentroService
    ) { }

    resolve(): Observable<Centro[]> {
        return this.centroService.get();
    }
}