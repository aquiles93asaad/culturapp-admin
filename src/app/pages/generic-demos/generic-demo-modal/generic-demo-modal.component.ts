import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

import { GenericDemo } from '../../../core/models';
import { GenericDemoService } from '../../../core/services';

@Component({
    selector: 'app-generic-demo-modal',
    templateUrl: './generic-demo-modal.component.html',
    styleUrls: ['./generic-demo-modal.component.scss']
})
export class GenericDemoModalComponent implements OnInit {
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    genericDemoForm: FormGroup;
    isSubmitting: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<GenericDemoModalComponent>,
        private snackBar: MatSnackBar,
        private genericDemoService: GenericDemoService,
        @Optional() @Inject(MAT_DIALOG_DATA) public genericDemo: GenericDemo
    ) { }

    ngOnInit() {
        this.genericDemoForm = this.formBuilder.group({
            name: [(this.genericDemo) ? this.genericDemo.name : ''],
            description: [(this.genericDemo) ? this.genericDemo.description : ''],
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.genericDemoForm.controls; }

    closeDialog() {
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    submitForm() {
        if(this.genericDemoForm.valid) {
            if(!this.genericDemo) {
                this.isSubmitting = true;
                const newConstants: GenericDemo = this.genericDemoForm.value;
                this.genericDemoService.create(newConstants)
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
                    this.genericDemoService.update(this.genericDemo)
                    .subscribe(
                        genericDemo => {
                            this.dialogRef.close(genericDemo);
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
        const controls = this.genericDemoForm.controls
        for (const control in controls) {
            if (controls.hasOwnProperty(control)) {
                if(this.genericDemo[control] != controls[control].value) {
                    this.genericDemo[control] = controls[control].value;
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