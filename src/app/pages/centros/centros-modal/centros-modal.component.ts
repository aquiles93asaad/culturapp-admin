import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CentroService } from '../../../core/services';
import { Centro } from '../../../core/models'

@Component({
	selector: 'app-centros-modal',
	templateUrl: './centros-modal.component.html',
	styleUrls: ['./centros-modal.component.scss']
})
export class CentrosModalComponent implements OnInit {
	isSubmitting: boolean = false;
	centroForm: FormGroup;

	constructor(
		public dialogRef: MatDialogRef<CentrosModalComponent>,
		private fb: FormBuilder,
		public centroService : CentroService,
		private snackBar: MatSnackBar,
		@Optional() @Inject(MAT_DIALOG_DATA) public centro: Centro
	) { }

	ngOnInit() {
		this.centroForm = this.fb.group({
			nombre: [(this.centro) ? this.centro.nombre : ''],
            descripcion: [(this.centro) ? this.centro.descripcion : ''],
            direccion: [(this.centro) ? this.centro.direccion : ''],
		});
	}

	get f() { return this.centroForm.controls; }

	submitForm(){
		if (this.centroForm.valid) {
			if(!this.centro) {
				let centro = this.centroForm.value;
				this.isSubmitting = true;
				this.centroService.create(centro)
				.subscribe(
					newCentro => {
						this.dialogRef.close(newCentro);
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
					this.centroService.update(this.centro)
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
        const controls = this.centroForm.controls
        for (const control in controls) {
            if (controls.hasOwnProperty(control)) {
                if(this.centro[control] != controls[control].value) {
                    this.centro[control] = controls[control].value;
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
