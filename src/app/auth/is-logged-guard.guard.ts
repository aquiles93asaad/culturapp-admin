import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class IsLoggedGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(
        
    ) {
        return this.authService.isAuthenticated.pipe(
            take(1),
            map(
                isAuth => {
                    if(isAuth) {
                        this.router.navigate(['/dashboard/inicio']);
                    }
                    return !isAuth;
                }
            )
        );
    }
}
