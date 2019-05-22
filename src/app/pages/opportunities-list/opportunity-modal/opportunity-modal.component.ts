import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Opportunity } from '../../../core/models';
import { OpportunityService, CompanyService } from '../../../core/services';

@Component({
    selector: 'app-opportunity-modal',
    templateUrl: './opportunity-modal.component.html',
    styleUrls: ['./opportunity-modal.component.scss']
})
export class OpportunityModalComponent implements OnInit {
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    opportunityForm: FormGroup;
    isSubmitting: boolean = false;
    clients: any;

    constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<OpportunityModalComponent>,
        private snackBar: MatSnackBar,
        private opportunityService: OpportunityService,
        private companyService: CompanyService,
        @Optional() @Inject(MAT_DIALOG_DATA) public opportunity: Opportunity
    ) { }

    ngOnInit() {
        this.opportunityForm = this.formBuilder.group({
            companyClient: [{ value: this.opportunity.companyClient._id, disabled: (this.opportunity.state == 'won') ? true: false }],
            name: [{ value: this.opportunity.name, disabled: (this.opportunity.state == 'won') ? true: false }],
            description: [{ value: this.opportunity.description, disabled: (this.opportunity.state == 'won') ? true: false }],
            digitization: [{ value: this.opportunity.digitization, disabled: (this.opportunity.state == 'won') ? true: false }],
            docManager: [{ value: this.opportunity.docManager, disabled: (this.opportunity.state == 'won') ? true: false }],
            hardware: [{ value: this.opportunity.hardware, disabled: (this.opportunity.state == 'won') ? true: false }],
            automation: [{ value: this.opportunity.automation, disabled: (this.opportunity.state == 'won') ? true: false }]
        });

        this.companyService.get({ isClient: true })
        .subscribe(
            clients => {
                this.clients = clients;
            }
        )
    }

    // convenience getter for easy access to form fields
    get f() { return this.opportunityForm.controls; }

    closeDialog() {
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    submitForm() {
        this.isSubmitting = true;
        if(this.opportunityForm.valid && this.dataChanged()) {
            this.isSubmitting = true;
            this.opportunityService.update(this.opportunity)
            .subscribe(
                opportunity => {
                    this.dialogRef.close(opportunity);
                },
                error => {
                    this.showMessage(error.statusText);
                },
                () => {
                    this.isSubmitting = false;
                }
            )
        }
    }

    private dataChanged(): boolean {
        let result = false;
        const controls = this.opportunityForm.controls
        for (const control in controls) {
            if (controls.hasOwnProperty(control)) {
                if(this.opportunity[control] != controls[control].value) {
                    this.opportunity[control] = controls[control].value;
                    result = true;
                }
            }
        }
        return result;
    }

    private showMessage(message) {
        this.snackBar.open(message, '', {
            duration: 2000,
            panelClass: ['justify-content-center', 'd-flex', 'mb-3']
        });
    }
}