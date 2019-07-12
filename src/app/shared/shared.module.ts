import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxEchartsModule } from 'ngx-echarts';
import { MaterialModule } from './material.module';
import {
    DynamicTableComponent,
    DynamicFiltersComponent,
    BreadcrumbsComponent,
    MultipleFabBtnComponent,
    UserModalComponent,
    ConfirmDeleteModalComponent
} from './components';
import { BooelanTextValuePipe, EnumTextValuePipe } from './pipes';

@NgModule({
    declarations: [
        DynamicTableComponent,
        DynamicFiltersComponent,
        BreadcrumbsComponent,
        MultipleFabBtnComponent,
        UserModalComponent,
        ConfirmDeleteModalComponent,
        BooelanTextValuePipe,
        EnumTextValuePipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        RouterModule,
        MaterialModule,
        NgxEchartsModule,
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MaterialModule,
        DynamicTableComponent,
        DynamicFiltersComponent,
        BreadcrumbsComponent,
        MultipleFabBtnComponent,
        UserModalComponent,
        ConfirmDeleteModalComponent,
        NgxEchartsModule
    ],
    entryComponents: [
        UserModalComponent,
        ConfirmDeleteModalComponent
    ],
})
export class SharedModule { }
