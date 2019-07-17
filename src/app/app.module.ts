import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AuthHeaderInterceptor } from './core/interceptors/header.interceptor';
import { CatchErrorInterceptor } from './core/interceptors/http-error.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth/auth.service';

import {
    DashboardLayoutComponent,
    FaqsComponent,
    HomeComponent,
    UserProfileComponent,
    UsuariosComponent,
    ProfesoresComponent,
    CursosComponent,
    MateriasComponent,
    CentrosComponent,
    NotificacionesComponent,
    AsistenciasComponent,
    CentrosModalComponent,
    CursosModalComponent,
    MateriasModalComponent,
    ProfesoresModalComponent,
    AdministradoresComponent
} from './pages';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
    parse: {
      dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
    },
};

@NgModule({
    declarations: [
        AppComponent,
        DashboardLayoutComponent,
        FaqsComponent,
        HomeComponent,
        UserProfileComponent,
        UsuariosComponent,
        ProfesoresComponent,
        CursosComponent,
        MateriasComponent,
        CentrosComponent,
        NotificacionesComponent,
        AsistenciasComponent,
        CentrosModalComponent,
        CursosModalComponent,
        MateriasModalComponent,
        ProfesoresModalComponent,
        AdministradoresComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule,
        SharedModule,
        CoreModule,
        AuthModule,
        AppRoutingModule,
        NgbModule
    ],
    providers: [
        AuthService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthHeaderInterceptor,
            multi: true,
        }, {
            provide: HTTP_INTERCEPTORS,
            useClass: CatchErrorInterceptor,
            multi: true,
        },
        {
            provide: MAT_DATE_LOCALE,
            useValue: 'es-AR'
        },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE]
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: MY_FORMATS
        },
    ],
    entryComponents: [
        FaqsComponent,
        UserProfileComponent,
        CentrosModalComponent,
        CursosModalComponent,
        MateriasModalComponent,
        ProfesoresModalComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
