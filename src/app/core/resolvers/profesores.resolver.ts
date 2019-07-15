import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { User } from '../models';
import { UserService } from '../services';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class ProfesoresResolver implements Resolve<User[]> {

    constructor(
        private userService: UserService,
        private authService: AuthService
    ) { }

    resolve(): Observable<User[]> {
        let filters = {
            esProfesor: true
        };

        this.authService.userSource.subscribe(
            (user: any) => {
                if(user && !user.esSuperAdmin)
                    filters['centro'] = user.centro._id;
            }
        );

        return this.userService.get(filters);
    }
}