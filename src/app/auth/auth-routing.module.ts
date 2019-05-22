import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsLoggedGuard } from './is-logged-guard.guard';

import { AuthComponent } from './auth.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: '/login',
                pathMatch: 'full'
            }, {
                path: 'login',
                component: AuthComponent,
                canActivate: [IsLoggedGuard]
            }
            // , {
            //     path: 'register',
            //     component: AuthComponent,
            //     canActivate: [IsLoggedGuard]
            // }, {
            //     path: 'new-user',
            //     component: RegisterComponent
            // }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [IsLoggedGuard],
})

export class AuthRoutingModule { }
