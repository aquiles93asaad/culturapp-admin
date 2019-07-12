import { Component, OnInit, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User, Centro } from '../../../core/models';
import { UserService, CentroService } from '../../../core/services';
import * as $ from 'jquery';

@Component({
    selector: 'app-user-modal',
    templateUrl: './user-modal.component.html',
    styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {
    userForm: FormGroup;
    isSubmitting: boolean = false;
    centros: Centro[];

    constructor(
        public dialogRef: MatDialogRef<UserModalComponent>,
        private snackBar: MatSnackBar,
        private fb: FormBuilder,
        private userService: UserService,
        private centroService: CentroService,
        @Optional() @Inject(MAT_DIALOG_DATA) public user: any
    ) { }

    ngOnInit() {
        this.centroService.get()
        .subscribe(
            centros => {
                this.centros = centros;
            },
            error => {
                console.log(error);
            }
        )

        this.userForm = this.fb.group({
            nombre: [(this.user) ? this.user.nombre : ''],
            apellido: [(this.user) ? this.user.apellido : ''],
            email: [(this.user) ? this.user.email : '' , Validators.email],
            dni: [(this.user) ? this.user.dni : ''],
            telefono: [(this.user) ? this.user.telefono : ''],
            sexo: [(this.user) ? this.user.sexo : ''],
            direccion: [(this.user) ? this.user.direccion : ''],
            rol: [(this.user) ? (this.user.esAdmin) ? '1' : (this.user.esSuperAdmin) ? '2' : '' : ''],
            centroAdmin: [(this.user) ? (this.user.centroAdmin) ? this.user.centroAdmin._id : '' : ''],
        });
    }

    get f() { return this.userForm.controls; }

    closeDialog() {
        this.dialogRef.close();
    }

    submitForm() {
        if(this.userForm.valid) {
            if(!this.user){
                this.isSubmitting = true;
                let user: User = this.userForm.value;
                user.email = user.email.toLowerCase();
                this.userService.create(user)
                .subscribe(
                    newUser => {
                        this.dialogRef.close(newUser);
                    },
                    error => {
                        console.log(error);
                    }
                )
            } else {
                if(this.dataChanged()) {
                    this.isSubmitting = true;
                    this.user.email = this.user.email.toLowerCase();
                    this.userService.update(this.user)
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

    // private getSupervisors() {
    //     let result = [];
    //     for (let i = 0; i < this.user.company.users.length; i++) {
    //         if(this.hasCommonElement(this.user.company.users[i].roles, ['SUPERVISOR', 'LIDER'])) {
    //             result.push(this.user.company.users[i]);
    //         }
    //     }
    //     return result;
    // }

    // private hasCommonElement(arr1, arr2) {
    //     var bExists = false;
    //     $.each(arr2, function(index, value){

    //         if($.inArray(value,arr1)!=-1){
    //             bExists = true;
    //         }

    //         if(bExists){
    //             return false;
    //         }
    //     });
    //     return bExists;
    // }

    private dataChanged(): boolean {
        let result = false;
        const controls = this.userForm.controls
        for (const control in controls) {
            if (controls.hasOwnProperty(control)) {
                let doChange = false;
                if((this.user[control] != controls[control].value)) {
                    doChange = true;
                }

                if(doChange) {
                    this.user[control] = controls[control].value;
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
