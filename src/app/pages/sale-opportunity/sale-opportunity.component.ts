import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatVerticalStepper, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyModalComponent } from '../../shared/components';
import { OpportunityService } from '../../core/services';
import { Opportunity, Breadcrumb } from '../../core/models';

@Component({
    selector: 'app-sale-opportunity',
    templateUrl: './sale-opportunity.component.html',
    styleUrls: ['./sale-opportunity.component.scss']
})

export class SaleOpportunityComponent implements OnInit {
    breakpoint: any;
    isLinear = false;
    radiobutton = false;
    opportunity: Opportunity = null;

    breadcrumbs: Breadcrumb[] = [
        { text: 'Inicio', href: '/dashboard/inicio' },
        { text: 'Generar oportunidad', href: '/dashboard/oportunidad-de-venta' }
    ];

    steps: any = [
        {
            stepLabel: 'Datos del potencial cliente',
            stepFormGroup: FormGroup,
            formFields: [
                {
                    type: 'select', fieldControl: 'companyName', fieldLabel: 'Nombre Empresa', required: true, hasMiniBtn: true, col: 12, colSm: 12, colMd: 6, colLg: 4,
                    options: []
                }
            ]
        }, {
            stepLabel: 'Datos de la oportunidad',
            stepFormGroup: FormGroup,
            formFields: [
                { type: 'text', fieldControl: 'name', fieldLabel: 'Nombre de oportunidad', required: true, col: 12, colSm: 12, colMd: 12, colLg: 12 },
                { type: 'text', fieldControl: 'description', fieldLabel: 'Descripción', required: true, col: 12, colSm: 12, colMd: 12, colLg: 12 },
                { type: 'boolean', fieldControl: 'digitization', fieldLabel: 'Digitalizacion', label: 'Digitalizacion', col: 12, colSm: 6, colMd: 4, colLg: 3 },
                { type: 'boolean', fieldControl: 'docManager', fieldLabel: 'Gestor documental', label: 'Gestor documental', col: 12, colSm: 6, colMd: 4, colLg: 3 },
                { type: 'boolean', fieldControl: 'hardware', fieldLabel: 'Hatdware', label: 'Hardware', col: 12, colSm: 6, colMd: 4, colLg: 3 },
                { type: 'boolean', fieldControl: 'automation', fieldLabel: 'Automatizacion', label: 'Automatización proceso', col: 12, colSm: 6, colMd: 4, colLg: 3 }
            ]
        }
    ];

    constructor(
        private _formBuilder: FormBuilder,
        private _route: ActivatedRoute,
        public dialog: MatDialog,
        private opporunityService: OpportunityService,
        private snackBar: MatSnackBar,
        private route: Router
    ) { }

    openDialog() {
        const dialogRef = this.dialog.open(CompanyModalComponent, {
            height: '96%',
            width: '50%'
        });;
        dialogRef.afterClosed().subscribe(result => {
            if (typeof result !== 'undefined') {
                this.steps[0].formFields[0].options.push(result);
                this.steps[0].stepFormGroup.get('companyName').setValue(result._id+'|'+result.name);
            }
        });
    }

    ngOnInit() {
        this.breakpoint = (window.innerWidth <= 600) ? 12 : (window.innerWidth <= 992) ? 6 : (window.innerWidth <= 1400) ? 4 : (window.innerWidth > 1400) ? 3 : 3;
        
        this._route.data.subscribe(
            data => {
                this.steps[0].formFields[0].options = data.companies;
            }
        )

        this.showFields();
    }

    onResize(event) {
        this.breakpoint = (event.target.innerWidth <= 600) ? 1 : (event.target.innerWidth <= 992) ? 2 : (event.target.innerWidth <= 1400) ? 3 : (event.target.innerWidth > 1400) ? 4 : 4;

        for (let i = 0; i < this.steps.length; i++) {
            for (let j = 0; j < this.steps[i].formFields.length; j++) {
                if (this.steps[i].formFields[j].cols == 'break')
                    this.steps[i].formFields[j].cols = this.breakpoint;
            }
        }
    }

    opportunityFilter(){
        this.route.navigateByUrl('/dashboard/oportunidades');
    }

    createOpportunity(stepper: MatVerticalStepper) {
        if (this.steps[1].stepFormGroup.get('automation').value == true) {
            this.steps[1].stepFormGroup.get('docManager').value = true;
        }
        if (this.steps[1].stepFormGroup.valid && (this.steps[1].stepFormGroup.get('digitization').value || this.steps[1].stepFormGroup.get('docManager').value) ) {
            let opportunity: Opportunity = this.steps[1].stepFormGroup.value;
            const companyValues = this.steps[0].stepFormGroup.get('companyName').value.split('|')
            opportunity.companyClient = companyValues[0];
            this.opporunityService.create(opportunity)
                .subscribe(
                    opportunity => {
                        this.opportunity = opportunity;
                        stepper.next();
                    }
                )
        } else {
            this.snackBar.open('Los datos de la oportunidad estan incompletos', '', {
                duration: 2000,
                panelClass: ['justify-content-center', 'd-flex', 'mb-3']
            });
        }
    }

    showFields(){
        for (let i = 0; i < this.steps.length; i++) {
            let fields = {};
            for (let j = 0; j < this.steps[i].formFields.length; j++) {
                fields[this.steps[i].formFields[j].fieldControl] = [
                    (this.steps[i].formFields[j].type == 'boolean') ? false : '',
                    (this.steps[i].formFields[j].required) ? Validators.required : null
                ];

                if (this.steps[i].formFields[j].cols == 'break')
                    this.steps[i].formFields[j].cols = this.breakpoint;
            }
            this.steps[i].stepFormGroup = this._formBuilder.group(fields);
        }
    }
}