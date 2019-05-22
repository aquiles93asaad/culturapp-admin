import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        public router: Router,
        private authService: AuthService
    ) { }

    canActivate() {
        return this.authService.isAuthenticated.pipe(
            take(1),
            map(
                isAuth => {
                    if(!isAuth) {
                        this.router.navigate(['/login']);
                    }
                    return isAuth;
                }
            )
        );
    }
}
