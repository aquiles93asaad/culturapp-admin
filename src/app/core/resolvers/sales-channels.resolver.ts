import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CompanyService } from '../services';
import { Company } from '../models';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class SalesChannelsResolver implements Resolve<Company[]> {

    constructor(
        private companyService: CompanyService,
        private authService: AuthService
    ) { }

    resolve(): Observable<Company[]> {
        let filters = {};
        this.authService.userSource.subscribe(
            (user: any) => {
                if(user) {
                    // Get the ids of the sales channels if they exist so the user can see the sales channels of his company and the sales channels of his sales channels
                    let companiesIds = [];
                    if(user.userCompany.salesChannels && user.userCompany.salesChannels.length != 0) {
                        for (let i = 0; i < user.userCompany.salesChannels.length; i++) {
                            companiesIds.push(user.userCompany.salesChannels[i]._id);
                        }
                    }
                    companiesIds.push(user.userCompany._id);
                    filters['salesChannelOf'] = { $in: companiesIds };
                }
            }
        );
        return this.companyService.get(filters);
    }
}