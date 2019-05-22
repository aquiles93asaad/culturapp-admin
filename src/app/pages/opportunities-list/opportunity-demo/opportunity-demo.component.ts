import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';

import { OpportunityDemo, Opportunity, GenericDemo } from '../../../core/models';
import { OpportunityDemoService, GenericDemoService } from '../../../core/services';

@Component({
    selector: 'app-opportunity-demo',
    templateUrl: './opportunity-demo.component.html',
    styleUrls: ['./opportunity-demo.component.scss']
})
export class OpportunityDemoComponent implements OnInit {
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    demoForm: FormGroup;
    isSubmitting: boolean = false;
    genericDemos: GenericDemo[];
    chosenGenericDemos: GenericDemo[];
    private canChooseDate = ((<any>window).user.userCompany.salesChannelOf) ? false : true;

    constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<OpportunityDemoComponent>,
        private snackBar: MatSnackBar,
        private demoService: OpportunityDemoService,
        private genericDemoService: GenericDemoService,
        @Optional() @Inject(MAT_DIALOG_DATA) public opportunity: Opportunity
    ) { }

    ngOnInit() {
        const demo = this.opportunity.opportunityDemo;
        this.demoForm = this.formBuilder.group({
            demoType: [(demo) ? demo.demoType : 'GENERIC'],
            chosenGenericDemos: [(demo) ? demo.chosenGenericDemos : ''],
            description: [(demo) ? demo.description : ''],
            possibleDate_1: [(demo && demo.possibleDate_1) ? demo.possibleDate_1 : ''],
            possibleDate_1_time: [(demo && demo.possibleDate_1) ? moment(demo.possibleDate_1).format('HH:mm') : ''],
            possibleDate_2: [(demo && demo.possibleDate_2) ? demo.possibleDate_2 : ''],
            possibleDate_2_time: [(demo && demo.possibleDate_2) ? moment(demo.possibleDate_2).format('HH:mm') : ''],
            possibleDate_3: [(demo && demo.possibleDate_3) ? demo.possibleDate_3 : ''],
            possibleDate_3_time: [(demo && demo.possibleDate_3) ? moment(demo.possibleDate_3).format('HH:mm') : ''],
            selectedDate: [{ value: (demo && demo.selectedDate) ? demo.selectedDate : '', disabled: !this.canChooseDate }],
            selectedDate_time: [{ value: (demo && demo.selectedDate) ? moment(demo.selectedDate).format('HH:mm') : '', disabled: !this.canChooseDate }]
        });

        this.genericDemoService.get()
        .subscribe(
            genericDemos => {
                this.genericDemos = genericDemos;
                this.setChosenGnericDemo();
            }
        );
    }

    // convenience getter for easy access to form fields
    get f() { return this.demoForm.controls; }

    closeDialog() {
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    setChosenDemo() {
        this.setChosenGnericDemo();
    }

    submitForm() {
        if(this.demoForm.valid) {
            if(!this.opportunity.opportunityDemo) {
                this.isSubmitting = true;
                const newDemo: OpportunityDemo = this.demoForm.value;
                this.parseDemoDates(newDemo);
                this.demoService.create(newDemo, this.opportunity._id)
                .subscribe(
                    demo => {
                        this.dialogRef.close(demo);
                    },
                    error => {
                        this.showMessage(error.statusText);
                    },
                    () => {
                        this.isSubmitting = false;
                    }
                )
            } else {
                if(this.dataChanged()) {
                    this.isSubmitting = true;
                    this.parseDemoDates(this.opportunity.opportunityDemo);
                    this.demoService.update(this.opportunity.opportunityDemo)
                    .subscribe(
                        demo => {
                            this.dialogRef.close(demo);
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
        }
    }

    private setChosenGnericDemo() {
        if(this.demoForm.get('chosenGenericDemos').value) {
            for (let i = 0; i < this.genericDemos.length; i++) {
                if(this.demoForm.get('chosenGenericDemos').value.includes(this.genericDemos[i]._id)) {
                    if(typeof this.chosenGenericDemos === 'undefined') {
                        this.chosenGenericDemos = [];
                    }
                    
                    this.chosenGenericDemos.push(this.genericDemos[i]);
                } else {
                    this.removeFromChosenGenericDemos(this.genericDemos[i]._id);
                }
            }
        }
    }

    private removeFromChosenGenericDemos(demoId) {
        if(typeof this.chosenGenericDemos !== 'undefined') {
            for (let i = 0; i < this.chosenGenericDemos.length; i++) {
                if(this.chosenGenericDemos[i]._id == demoId) {
                    this.chosenGenericDemos.splice(i, 1);
                    break;
                }
            }
        }
    }

    private parseDemoDates(opportunity) {
        for (const key in opportunity) {
            if(opportunity.hasOwnProperty(key) && key.indexOf('Date') != -1 && key.indexOf('time') == -1) {
                if(opportunity[key] != '') {
                    let time = opportunity[key + '_time'].split(':');
                    opportunity[key] = moment(opportunity[key]).hours(time[0]).minutes(time[1]);
                } else {
                    delete opportunity[key];
                }
            }
        }
    }

    private dataChanged(): boolean {
        let result = false;
        const controls = this.demoForm.controls
        for (const control in controls) {
            if (controls.hasOwnProperty(control)) {
                if(this.opportunity.opportunityDemo[control] != controls[control].value) {
                    this.opportunity.opportunityDemo[control] = controls[control].value;
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