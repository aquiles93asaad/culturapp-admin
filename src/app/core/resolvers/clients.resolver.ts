import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CompanyService } from '../services';
import { Company } from '../models';

@Injectable()
export class ClientsResolver implements Resolve<Company[]> {

    constructor(
        private companyService: CompanyService
    ) { }

    resolve(): Observable<Company[]> {
        const filters = {
            isClient: true
        }
        return this.companyService.get(filters);
    }
}