import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { User } from '../models';
import { UserService } from '../services';

@Injectable()
export class UsersResolver implements Resolve<User[]> {

    constructor(
        private userService: UserService
    ) { }

    resolve(): Observable<User[]> {
        const filters = {
            $and: [
                { esAdmin: undefined },
                { esSuperAdmin: undefined },
                { esProfesor: undefined },
            ]
        }

        return this.userService.get(filters);
    }
}