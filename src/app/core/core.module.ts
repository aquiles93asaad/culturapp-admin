import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    AvailableCardsService,
    CompanyService,
    ConstantsService,
    GenericDemoService,
    OpportunityDemoService,
    OpportunityProposalService,
    OpportunityService,
    SolutionService,
    UserService,
    IndustryService
} from './services'
import { LoaderService } from './loader/loader.service';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        AvailableCardsService,
        CompanyService,
        ConstantsService,
        GenericDemoService,
        OpportunityDemoService,
        OpportunityProposalService,
        OpportunityService,
        SolutionService,
        UserService,
        IndustryService,
        LoaderService
    ],
    declarations: [
        LoaderComponent
    ],
    exports: [
        LoaderComponent
    ]
})
export class CoreModule { }
