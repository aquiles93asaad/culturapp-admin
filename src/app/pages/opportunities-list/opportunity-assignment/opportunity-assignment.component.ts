import { Component, OnInit, Inject, Optional  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OpportunityService } from '../../../core/services';

@Component({
    selector: 'app-opportunity-assignment',
    templateUrl: './opportunity-assignment.component.html',
    styleUrls: ['./opportunity-assignment.component.scss']
})
export class OpportunityAssignmentComponent implements OnInit {
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    assignmentForm: FormGroup;
    isSubmitting: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<OpportunityAssignmentComponent>,
        private opportunityService: OpportunityService,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {
        this.assignmentForm = this.formBuilder.group({
            assignedTo: [(this.data.opportunity.assignedTo) ? this.data.opportunity.assignedTo._id : ''],
        });

    }

    closeDialog() {
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    submitForm() {
        if(this.assignmentForm.valid) {
            this.isSubmitting = true;
            const opportunity = {
                _id: this.data.opportunity._id,
                assignedTo: this.assignmentForm.get('assignedTo').value
            }

            this.opportunityService.update(opportunity)
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

    private showMessage(message) {
        this.snackBar.open(message, '', {
            duration: 2000,
            panelClass: ['justify-content-center', 'd-flex', 'mb-3']
        });
    }
}