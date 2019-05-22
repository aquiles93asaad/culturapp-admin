import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { GenericDemoService } from '../services';
import { GenericDemo } from '../models';

@Injectable()
export class GenericDemosResolver implements Resolve<GenericDemo[]> {

    constructor(
        private genericDemosService: GenericDemoService
    ) { }

    resolve(): Observable<GenericDemo[]> {
        return this.genericDemosService.get();
    }
}