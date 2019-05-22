import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IndustryService } from '../../../core/services';
import { Industry } from '../../../core/models'

@Component({
	selector: 'app-industries-modal',
	templateUrl: './industries-modal.component.html',
	styleUrls: ['./industries-modal.component.scss']
})
export class IndustriesModalComponent implements OnInit {
	themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
	isSubmitting: boolean = false;
	industriesForm: FormGroup;

	constructor(
		public dialogRef: MatDialogRef<IndustriesModalComponent>,
		private fb: FormBuilder,
		public industryService : IndustryService,
		private snackBar: MatSnackBar,
		@Optional() @Inject(MAT_DIALOG_DATA) public industries: Industry
	) { }

	ngOnInit() {
		this.industriesForm = this.fb.group({
			name: [(this.industries) ? this.industries.name : ''],
			description: [(this.industries) ? this.industries.description : '']
		});
	}

	get f() { return this.industriesForm.controls; }

	submitForm(){
		if (this.industriesForm.valid) {
			if(!this.industries) {
				let industry = this.industriesForm.value;
				this.isSubmitting = true;
				this.industryService.create(industry)
				.subscribe(
					newIndustry => {
						this.dialogRef.close(newIndustry);
					},
					error => {
						console.log(error);
					},
					() => {
						this.isSubmitting = false;
					} 
				)
			} else {
				if(this.dataChanged()) {
					this.isSubmitting = true;
					this.industryService.update(this.industries)
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
        const controls = this.industriesForm.controls
        for (const control in controls) {
            if (controls.hasOwnProperty(control)) {
                if(this.industries[control] != controls[control].value) {
                    this.industries[control] = controls[control].value;
                    result = true;
                }
            }
        }
        return result;
    }

	onNoClick(): void {
        this.dialogRef.close();
	}
	
	private showMessage(message) {
        this.snackBar.open(message, '', {
            duration: 2000,
            panelClass: ['justify-content-center', 'd-flex', 'mb-3']
        });
    }

}
