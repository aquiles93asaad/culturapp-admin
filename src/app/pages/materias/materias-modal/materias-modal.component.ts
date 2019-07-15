import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MateriaService } from '../../../core/services';
import { Materia } from '../../../core/models'

@Component({
	selector: 'app-materias-modal',
	templateUrl: './materias-modal.component.html',
	styleUrls: ['./materias-modal.component.scss']
})
export class MateriasModalComponent implements OnInit {
	isSubmitting: boolean = false;
	materiaForm: FormGroup;

	constructor(
		public dialogRef: MatDialogRef<MateriasModalComponent>,
		private fb: FormBuilder,
		public materiaService : MateriaService,
		private snackBar: MatSnackBar,
		@Optional() @Inject(MAT_DIALOG_DATA) public materia: Materia
	) { }

	ngOnInit() {
		this.materiaForm = this.fb.group({
			nombre: [(this.materia) ? this.materia.nombre : ''],
            descripcion: [(this.materia) ? this.materia.descripcion : ''],
		});
	}

	get f() { return this.materiaForm.controls; }

	submitForm(){
		if (this.materiaForm.valid) {
			if(!this.materia) {
				let materia = this.materiaForm.value;
				this.isSubmitting = true;
				this.materiaService.create(materia)
				.subscribe(
					newMateria => {
						this.dialogRef.close(newMateria);
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
					this.materiaService.update(this.materia)
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
        const controls = this.materiaForm.controls
        for (const control in controls) {
            if (controls.hasOwnProperty(control)) {
                if(this.materia[control] != controls[control].value) {
                    this.materia[control] = controls[control].value;
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
