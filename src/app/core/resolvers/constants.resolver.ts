import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ConstantsService } from '../services';
import { Constants } from '../models';

@Injectable()
export class ConstantsResolver implements Resolve<Constants[]> {

    constructor(
        private constantsService: ConstantsService
    ) { }

    resolve(): Observable<Constants[]> {
        return this.constantsService.get();
    }
}