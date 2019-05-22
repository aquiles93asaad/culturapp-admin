import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

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
    ClientsComponent,
    ConstantsModalComponent,
    ConstantsComponent,
    DashboardLayoutComponent,
    FaqsComponent,
    GenericDemoModalComponent,
    GenericDemosComponent,
    HomeComponent,
    IndustriesComponent,
    IndustriesModalComponent,
    MyTeamComponent,
    OpportunitiesListComponent,
    OpportunityAssignmentComponent,
    OpportunityDemoComponent,
    OpportunityProposalComponent,
    OpportunityProposalBreakdownComponent,
    OpportunityModalComponent,
    ReportsComponent,
    SaleOpportunityComponent,
    SalesChannelsComponent,
    SolutionsComponent,
    SolutionModalComponent,
    UserProfileComponent,
} from './pages';

@NgModule({
    declarations: [
        AppComponent,
        ClientsComponent,
        ConstantsModalComponent,
        ConstantsComponent,
        DashboardLayoutComponent,
        FaqsComponent,
        GenericDemoModalComponent,
        GenericDemosComponent,
        HomeComponent,
        IndustriesComponent,
        IndustriesModalComponent,
        MyTeamComponent,
        OpportunitiesListComponent,
        OpportunityAssignmentComponent,
        OpportunityDemoComponent,
        OpportunityProposalComponent,
        OpportunityProposalBreakdownComponent,
        OpportunityModalComponent,
        ReportsComponent,
        SaleOpportunityComponent,
        SalesChannelsComponent,
        SolutionsComponent,
        SolutionModalComponent,
        UserProfileComponent,
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
        }
    ],
    entryComponents: [
        ConstantsModalComponent,
        FaqsComponent,
        GenericDemoModalComponent,
        IndustriesModalComponent,
        OpportunityAssignmentComponent,
        OpportunityDemoComponent,
        OpportunityProposalBreakdownComponent,
        OpportunityProposalComponent,
        OpportunityModalComponent,
        SolutionModalComponent,
        UserProfileComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
