import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { concatMap } from 'rxjs/operators';

import { User } from '../../../core/models';
import { UserService } from '../../../core/services';

@Component({
    selector: 'app-profesores-modal',
    templateUrl: './profesores-modal.component.html',
    styleUrls: ['./profesores-modal.component.scss']
})
export class ProfesoresModalComponent implements OnInit {
    profesorForm: FormGroup;
    isSubmitting: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<ProfesoresModalComponent>,
        private snackBar: MatSnackBar,
        private fb: FormBuilder,
        private userService: UserService,
        @Optional() @Inject(MAT_DIALOG_DATA) public profesor: any
    ) { }

    ngOnInit() {
        this.profesorForm = this.fb.group({
            nombre: [(this.profesor) ? this.profesor.nombre : ''],
            apellido: [(this.profesor) ? this.profesor.apellido : ''],
            email: [(this.profesor) ? this.profesor.email : '' , Validators.email],
            dni: [(this.profesor) ? this.profesor.dni : ''],
            telefono: [(this.profesor) ? this.profesor.telefono : ''],
            sexo: [(this.profesor) ? this.profesor.sexo : ''],
            direccion: [(this.profesor) ? this.profesor.direccion : ''],
        });
    }

    get f() { return this.profesorForm.controls; }

    closeDialog() {
        this.dialogRef.close();
    }

    submitForm() {
        if(this.profesorForm.valid) {
            if(!this.profesor){
                this.isSubmitting = true;
                let profesor: User = this.profesorForm.value;
                profesor.centro = (<any>window).user.centro;
                profesor.email = profesor.email.toLowerCase();
                profesor.esProfesor = true;
                this.userService.check(profesor.email).pipe(
                    concatMap( (userExists) => {
                        if(userExists) {
                            this.profesorForm.get('email').setErrors({ userExists: true });
                            return null;
                        }
        
                        return this.userService.create(profesor)
                    } )
                ).subscribe(
                    (newProfesor) => {
                        this.dialogRef.close(newProfesor);
                        
                    }, 
                    error => {
                        console.log(error);
                        this.showMessage(error);
                    },
                    () => {
                        this.isSubmitting = false;
                    }
                )
            } else {
                if(this.dataChanged()) {
                    this.isSubmitting = true;
                    this.profesor.email = this.profesor.email.toLowerCase();
                    this.userService.update(this.profesor)
                    .subscribe(
                        user => {
                            this.dialogRef.close(user);
                        },   
                        error => {
                            this.showMessage(error.statusText);
                        },
                        () => {
                            this.isSubmitting = false;
                        }
                    )
                }
                 else {
                    this.onNoClick();
                }
            }
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    private dataChanged(): boolean {
        let result = false;
        const controls = this.profesorForm.controls
        for (const control in controls) {
            if (controls.hasOwnProperty(control)) {
                let doChange = false;
                if((this.profesor[control] != controls[control].value)) {
                    doChange = true;
                }

                if(doChange) {
                    this.profesor[control] = controls[control].value;
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
