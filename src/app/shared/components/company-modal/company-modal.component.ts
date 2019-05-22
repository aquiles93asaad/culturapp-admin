import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Company, Industry } from '../../../core/models';
import { CompanyService, IndustryService } from '../../../core/services';
import { Router } from '@angular/router';

@Component({
    selector: 'app-company-modal',
    templateUrl: './company-modal.component.html',
    styleUrls: ['./company-modal.component.scss']
})
export class CompanyModalComponent implements OnInit {
    companyForm: FormGroup;
    isSubmitting: boolean = false;
    private inSalesChannel: boolean;
    
    countries = [
        'Argentina',
        'Chile',
        'Colombia',
        'Ecuador',
        'México',
        'Perú',
        'Uruguay',
        'USA'
    ];
    
    industries : Industry;

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<CompanyModalComponent>,
        private fb: FormBuilder,
        private companyService: CompanyService,
        private industryService: IndustryService,
        @Optional() @Inject(MAT_DIALOG_DATA) public company: Company
    ) { }

    ngOnInit() {
        // let askIfSalesChannel: boolean;
        const url = this.router.url.split('/');
        if(url[url.length - 1] == 'canales-de-venta') {
            this.inSalesChannel = true;
        } else {
            this.inSalesChannel = false;
        }


        if(typeof this.industryService.get() !== 'undefined'){
            this.industryService.get()
            .subscribe(
                industry => {
                    this.industries = industry;
                }
            );
        }

        this.companyForm = this.fb.group({
            name: [(this.company) ? this.company.name : '', Validators.required],
            cuit: [(this.company) ? this.company.cuit : '', Validators.required],
            country: [(this.company) ? this.company.country : '', Validators.required],
            phone: [(this.company) ? this.company.phone : '', Validators.required],
            employeesCount: [(this.company) ? this.company.employeesCount : '', (!this.inSalesChannel) ? Validators.required : []],
            branchesNumber: [(this.company) ? this.company.branchesNumber : '', (!this.inSalesChannel) ? Validators.required : []],
            industry: [(this.company) ? this.company.industry : '', (!this.inSalesChannel) ? Validators.required : []],
            anualBilling: [(this.company) ? this.company.anualBilling : ''],
            type: [(this.company) ? this.company.type : '', Validators.required],
            origin: [(this.company) ? this.company.origin : '', Validators.required],
            address: [(this.company) ? this.company.address : ''],
            webSite: [(this.company) ? this.company.webSite : ''],
            hasStandard: [(this.company) ? this.company.hasStandard : false]
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    // convenience getter for easy access to form fields
    get f() { return this.companyForm.controls; }

    submitForm() {
        if(this.companyForm.valid) {
            if(!this.company) {
                let newCompany: Company = this.companyForm.value;
                this.isSubmitting = true;
                if(!this.inSalesChannel) {
                    // If it's not from sales-channels then it's a client company
                    newCompany.isClient = true;
                    this.companyService.create(newCompany)
                    .subscribe(
                        company => {
                            this.dialogRef.close(company);
                        },
                        error => {
                            if(error.error == 'company-exists'){
                                this.companyForm.get('name').setErrors({ invalidCompany: error.statusText });
                            }
                        },
                        () => {
                            this.isSubmitting = false;
                        }
                    )
                } else {
                    this.companyService.addSalesChannel(newCompany)
                    .subscribe(
                        company => {
                            this.dialogRef.close(company);
                        },
                        error => {
                            if(error.error == 'company-exists'){
                                this.companyForm.get('name').setErrors({ invalidCompany: error.statusText });
                            }
                        },
                        () => {
                            this.isSubmitting = false;
                        }
                    )
                }
            } else {
                if(this.dataChanged()) {
                    this.isSubmitting = true;
                    this.companyService.update(this.company)
                    .subscribe(
                        company => {
                            this.dialogRef.close(company);
                        },
                        error => {
                            if(error.error == 'company-exists'){
                                this.companyForm.get('name').setErrors({ invalidCompany: error.statusText });
                            }
                        },
                        () => {
                            this.isSubmitting = false;
                        }
                    )
                } else {
                    this.onNoClick();
                }
            }
        }
    }

    private dataChanged(): boolean {
        let result = false;
        const controls = this.companyForm.controls
        for (const control in controls) {
            if (controls.hasOwnProperty(control)) {
                if(this.company[control] != controls[control].value) {
                    this.company[control] = controls[control].value;
                    result = true;
                }
            }
        }
        return result;
    }
}
