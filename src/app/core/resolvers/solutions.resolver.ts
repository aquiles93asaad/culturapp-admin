import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Solution } from '../models';
import { SolutionService } from '../services';

@Injectable()
export class SolutionsResolver implements Resolve<Solution[]> {

    constructor(
        private solutionService: SolutionService
    ) { }

    resolve(): Observable<Solution[]> {
        const filters = { 
            isGeneric : true
        };
        return this.solutionService.get(filters);
    }
}