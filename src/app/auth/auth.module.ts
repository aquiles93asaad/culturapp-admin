import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { AuthComponent } from './auth.component';
import { AuthService } from './auth.service';
import { TokenStorage } from './token.storage';
import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './register/register.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AuthRoutingModule,
    ],
    declarations: [
        AuthComponent,
        RegisterComponent
    ],
    providers: [
        AuthService,
        TokenStorage
    ]
})
export class AuthModule { }
