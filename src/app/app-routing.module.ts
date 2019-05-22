import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AuthGuard } from './auth/auth.guard';

// Resolvers
import {
    ClientsResolver,
    ConstantsResolver,
    GenericDemosResolver,
    HomeResolver,
    MyTeamResolver,
    OpportunitiesListResolver,
    SalesChannelsResolver,
    SolutionsResolver,
    IndustryResolver
} from './core/resolvers';

import {
    DashboardLayoutComponent,
    ClientsComponent,
    ConstantsComponent,
    GenericDemosComponent,
    HomeComponent,
    MyTeamComponent,
    OpportunitiesListComponent,
    ReportsComponent,
    SaleOpportunityComponent,
    SalesChannelsComponent,
    SolutionsComponent,
    IndustriesComponent
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
                path: 'clientes',
                component: ClientsComponent,
                canActivate: [AuthGuard],
                resolve: {
                    clients: ClientsResolver
                }
            },
            {
                path: 'constantes',
                component: ConstantsComponent,
                canActivate: [AuthGuard],
                resolve: {
                    constants: ConstantsResolver
                }
            },
            {
                path: 'demos-genericas',
                component: GenericDemosComponent,
                canActivate: [AuthGuard],
                resolve: {
                    genericDemos: GenericDemosResolver
                }
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
                path: 'mi-equipo',
                component: MyTeamComponent,
                canActivate: [AuthGuard],
                resolve: {
                    users: MyTeamResolver
                }
            },
            {
                path: 'oportunidades',
                component: OpportunitiesListComponent,
                canActivate: [AuthGuard],
                resolve: {
                    opportunitiesList: OpportunitiesListResolver
                }
            },
            {
                path: 'reportes',
                component: ReportsComponent,
                canActivate: [AuthGuard],
                resolve: {
                    opportunitiesList: OpportunitiesListResolver
                }
            },
            {
                path: 'oportunidad-de-venta',
                component: SaleOpportunityComponent,
                canActivate: [AuthGuard],
                resolve: {
                    companies: ClientsResolver
                }
            },
            {
                path: 'canales-de-venta',
                component: SalesChannelsComponent,
                canActivate: [AuthGuard],
                resolve: {
                    salesChannels: SalesChannelsResolver
                }
            },
            
            {
                path: 'soluciones',
                component: SolutionsComponent,
                canActivate: [AuthGuard],
                resolve: {
                    solutions: SolutionsResolver
                }
            },

            {
                path: 'industrias',
                component: IndustriesComponent,
                canActivate: [AuthGuard],
                resolve:{
                    industries: IndustryResolver
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
        ClientsResolver,
        ConstantsResolver,
        GenericDemosResolver,
        HomeResolver,
        OpportunitiesListResolver,
        MyTeamResolver,
        SalesChannelsResolver,
        SolutionsResolver,
        IndustryResolver
    ],
    declarations: []
})

export class AppRoutingModule {}
