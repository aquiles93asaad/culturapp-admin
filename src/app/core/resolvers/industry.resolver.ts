import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IndustryService } from '../services';
import { Industry } from '../models';

@Injectable()
export class IndustryResolver implements Resolve<Industry[]> {

    constructor(
        private industryService: IndustryService
    ) { }

    resolve(): Observable<Industry[]> {
        return this.industryService.get();
    }
}