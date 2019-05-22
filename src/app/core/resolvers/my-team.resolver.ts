import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../services';
import { User } from '../models';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class MyTeamResolver implements Resolve<User[]> {

    constructor(
        private userService: UserService,
        private authService: AuthService
    ) { }

    resolve(): Observable<User[]> {
        let filters = {};
        this.authService.userSource.subscribe(
            (user: any) => {
                if(user)
                    filters['userCompany'] = user.userCompany._id;
            }
        );
        return this.userService.get(filters);
    }
}