import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { User } from '../models';
import { UserService } from '../services';

@Injectable()
export class AdministradoresResolver implements Resolve<User[]> {

    constructor(
        private userService: UserService
    ) { }

    resolve(): Observable<User[]> {
        const filters = {
            $or: [
                { esAdmin: true },
                { esSuperAdmin: true },
            ]
        }
        return this.userService.get(filters);
    }
}