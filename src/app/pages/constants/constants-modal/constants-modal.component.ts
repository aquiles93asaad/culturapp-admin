import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Constants } from '../../../core/models';
import { ConstantsService } from '../../../core/services';

@Component({
    selector: 'app-constants-modal',
    templateUrl: './constants-modal.component.html',
    styleUrls: ['./constants-modal.component.scss']
})
export class ConstantsModalComponent implements OnInit {
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    constatnsForm: FormGroup;
    isSubmitting: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<ConstantsModalComponent>,
        private snackBar: MatSnackBar,
        private constantsService: ConstantsService,
        @Optional() @Inject(MAT_DIALOG_DATA) public constants: Constants
    ) { }

    ngOnInit() {
        this.constatnsForm = this.formBuilder.group({
            thubanLicense: [{ value: (this.constants) ? this.constants.thubanLicense : '', disabled: (this.constants) ? true : false }],
            thubanMaintenance: [{ value: (this.constants) ? this.constants.thubanMaintenance : '', disabled: (this.constants) ? true : false }],
            capitkaLicense: [{ value: (this.constants) ? this.constants.capitkaLicense : '', disabled: (this.constants) ? true : false }],
            captikaMaintenance: [{ value: (this.constants) ? this.constants.captikaMaintenance : '', disabled: (this.constants) ? true : false }],
            hourValue: [{ value: (this.constants) ? this.constants.hourValue : '', disabled: (this.constants) ? true : false }],
            docTypeHours: [{ value: (this.constants) ? this.constants.docTypeHours : '', disabled: (this.constants) ? true : false }],
            autoRecognitionDocHours: [{ value: (this.constants) ? this.constants.autoRecognitionDocHours : '', disabled: (this.constants) ? true : false }],
            documentClassHours: [{ value: (this.constants) ? this.constants.documentClassHours : '', disabled: (this.constants) ? true : false }],
            documentClassFieldHours: [{ value: (this.constants) ? this.constants.documentClassFieldHours : '', disabled: (this.constants) ? true : false }],
            wokflowHours: [{ value: (this.constants) ? this.constants.wokflowHours : '', disabled: (this.constants) ? true : false }],
            wokflowStatesHours: [{ value: (this.constants) ? this.constants.wokflowStatesHours : '', disabled: (this.constants) ? true : false }],
            monitorHours: [{ value: (this.constants) ? this.constants.monitorHours : '', disabled: (this.constants) ? true : false }],
            groupsHours: [{ value: (this.constants) ? this.constants.groupsHours : '', disabled: (this.constants) ? true : false }],
            installation: [{ value: (this.constants) ? this.constants.installation : '', disabled: (this.constants) ? true : false }],
            analisis: [{ value: (this.constants) ? this.constants.analisis : '', disabled: (this.constants) ? true : false }],
            adminsTraining: [{ value: (this.constants) ? this.constants.adminsTraining : '', disabled: (this.constants) ? true : false }],
            scriptingPercentaje: [{ value: (this.constants) ? this.constants.scriptingPercentaje : '', disabled: (this.constants) ? true : false }],
            secondPrototypePercentaje: [{ value: (this.constants) ? this.constants.secondPrototypePercentaje : '', disabled: (this.constants) ? true : false }],
            thirdPrototypePercentaje: [{ value: (this.constants) ? this.constants.thirdPrototypePercentaje : '', disabled: (this.constants) ? true : false }],
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.constatnsForm.controls; }

    closeDialog() {
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    submitForm() {
        if(this.constatnsForm.valid) {
            if(!this.constants) {
                this.isSubmitting = true;
                const newConstants: Constants = this.constatnsForm.value;
                newConstants.isActive = true;
                this.constantsService.create(newConstants)
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
                    this.constantsService.update(this.constants)
                    .subscribe(
                        constants => {
                            this.dialogRef.close(constants);
                        },
                        error => {
                            this.showMessage(error.statusText);
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
        const controls = this.constatnsForm.controls
        for (const control in controls) {
            if (controls.hasOwnProperty(control)) {
                if(this.constants[control] != controls[control].value) {
                    this.constants[control] = controls[control].value;
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