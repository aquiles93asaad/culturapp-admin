import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

import { OpportunityService, SolutionService } from '../services';
import { Opportunity, Solution } from '../models';

interface OpportunitiesListReturn {
    opportunities: Opportunity[];
    solutions: Solution[];
}

@Injectable()
export class OpportunitiesListResolver implements Resolve<OpportunitiesListReturn> {

    constructor(
        private opportunityService: OpportunityService,
        private solutionService: SolutionService
    ) { }

    resolve(): Observable<OpportunitiesListReturn> {
        return Observable.forkJoin([
            this.opportunityService.get(),
            this.solutionService.get({ isGeneric: true })
        ]).map(
            ([opportunities, solutions]) => ({
                opportunities: opportunities,
                solutions: solutions
            })
        );
    }
}