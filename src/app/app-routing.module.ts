import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AuthGuard } from './auth/auth.guard';

// Resolvers
import {
    HomeResolver,
    AsistenciasResolver,
    CentrosResolver,
    CursosResolver,
    MateriasResolver,
    NotificacionsResolver,
    UsersResolver,
    ProfesoresResolver,
    AdministradoresResolver
} from './core/resolvers';

// Components
import { 
    DashboardLayoutComponent,
    HomeComponent,
    UsuariosComponent,
    ProfesoresComponent,
    CursosComponent,
    MateriasComponent,
    CentrosComponent,
    NotificacionesComponent,
    AsistenciasComponent,
    AdministradoresComponent
} from './pages';

const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardLayoutComponent,
        resolve: {
            cards: HomeResolver
        },
        children: [
            {
                path: '',
                redirectTo: '/dashboard/inicio',
                pathMatch: 'full'
            },
            {
                path: 'inicio',
                component: HomeComponent,
                canActivate: [AuthGuard],
                resolve: {
                    cards: HomeResolver
                }
            },
            {
                path: 'usuarios',
                component: UsuariosComponent,
                canActivate: [AuthGuard],
                resolve: {
                    users: UsersResolver
                }
            },
            {
                path: 'administradores',
                component: AdministradoresComponent,
                canActivate: [AuthGuard],
                resolve: {
                    users: AdministradoresResolver
                }
            },
            {
                path: 'categorias',
                component: MateriasComponent,
                canActivate: [AuthGuard],
                resolve: {
                    materias: MateriasResolver
                }
            },
            {
                path: 'centros',
                component: CentrosComponent,
                canActivate: [AuthGuard],
                resolve: {
                    centros: CentrosResolver
                }
            },
            
            {
                path: 'profesores',
                component: ProfesoresComponent,
                canActivate: [AuthGuard],
                resolve: {
                    profesores: ProfesoresResolver
                }
            },
            {
                path: 'cursos',
                component: CursosComponent,
                canActivate: [AuthGuard],
                resolve: {
                    cursos: CursosResolver
                }
            },
            {
                path: 'notificaciones',
                component: NotificacionesComponent,
                canActivate: [AuthGuard],
                resolve: {
                    notificaciones: NotificacionsResolver
                }
            },
            {
                path: 'asistencias',
                component: AsistenciasComponent,
                canActivate: [AuthGuard],
                resolve: {
                    asistencias: AsistenciasResolver
                }
            },
        ]
    },
    {
        path: '**',
        redirectTo: '/dashboard/inicio',
        pathMatch: 'full'
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
        AuthGuard,
        HomeResolver,
        AsistenciasResolver,
        CentrosResolver,
        CursosResolver,
        MateriasResolver,
        NotificacionsResolver,
        UsersResolver,
        ProfesoresResolver,
        AdministradoresResolver
    ],
    declarations: []
})

export class AppRoutingModule {}
