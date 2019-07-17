import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
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
    sedesList: FormArray;

    localidades = [
        'Abasto',
        'Agronomía',
        'Almagro',
        'Balvanera',
        'Barracas',
        'Barrio Norte',
        'Belgrano',
        'Boedo',
        'Caballito',
        'Chacarita',
        'Ciudad Autónoma De Buenos Aires',
        'Coghlan',
        'Colegiales',
        'Constitución',
        'Flores',
        'Floresta',
        'La Boca',
        'Liniers',
        'Mataderos',
        'Microcentro',
        'Monte Castro',
        'Montserrat',
        'Nueva Pompeya',
        'Núñez',
        'Palermo',
        'Palermo Viejo',
        'Parque Avellaneda',
        'Parque Chacabuco',
        'Parque Patricios',
        'Paternal',
        'Puerto Madero',
        'Recoleta',
        'Retiro',
        'Saavedra',
        'San Cristobal',
        'San Nicolás',
        'San Telmo',
        'Velez Sarsfield',
        'Versalles',
        'Villa Crespo',
        'Villa del Parque',
        'Villa Devoto',
        'Villa General Mitre',
        'Villa Lugano',
        'Villa Luro',
        'Villa Ortúzar',
        'Villa Pueyrredón',
        'Villa Real',
        'Villa Riachuelo',
        'Villa Santa Rita',
        'Villa Soldati',
        'Villa Urquiza' 
    ];

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
            telefono: [(this.centro) ? this.centro.telefono : ''],
            sedes: this.fb.array(this.initialSedes())
        });
        
        this.sedesList = this.centroForm.get('sedes') as FormArray;
	}

	get f() { return this.centroForm.controls; }

    // returns all form groups under diasYHorarios
    get sedesFormGroup() {
        return this.centroForm.get('sedes') as FormArray;
    }

    addSede() {
        this.sedesList.push(
            this.fb.group({
                localidad: [''],
                direccion: [''],
                nombre: ['']
            })
        );
    }

    removeSede(i) {
        this.sedesList.removeAt(i);
    }

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

    private initialSedes(): FormGroup[] {
        let result: FormGroup[] = [];

        if(this.centro && this.centro.sedes && this.centro.sedes.length > 0) {
            for (let i = 0; i < this.centro.sedes.length; i++) {
                result.push(
                    this.fb.group({
                        localidad: [this.centro.sedes[i].localidad],
                        direccion: [this.centro.sedes[i].direccion],
                        nombre: [this.centro.sedes[i].nombre]
                    })
                );
            }
        } else {
            result.push(
                this.fb.group({
                    localidad: [''],
                    direccion: [''],
                    nombre: ['']
                })
            );
        }

        return result;
    }

}
