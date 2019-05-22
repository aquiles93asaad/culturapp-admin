import { Component, OnInit, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User } from '../../../core/models';
import { UserService } from '../../../core/services';
import * as $ from 'jquery';

@Component({
    selector: 'app-user-modal',
    templateUrl: './user-modal.component.html',
    styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    userForm: FormGroup;
    isSubmitting: boolean = false;
    supervisors: User[];
    inSalesChannel: boolean;
    canChooseProfile = ((<any>window).user.userCompany.salesChannelOf) ? false : true;

    profile = [
        'ADMIN',
        'COMERCIAL',
    ];
    role = [
        'LIDER',
        'SUPERVISOR',
        'EMPLEADO'
    ];

    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<UserModalComponent>,
        private snackBar: MatSnackBar,
        private fb: FormBuilder,
        private userService: UserService,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {
        const url = this.router.url.split('/');
        if(url[url.length - 1] == 'canales-de-venta') {
            this.inSalesChannel = true;
        } else {
            this.inSalesChannel = false;
        }

        // In my-team page, must get users data as only their IDS are available
        if(!this.inSalesChannel) {
            const filters = {
                _id: { "$in" : this.data.company.users },
                roles: ['SUPERVISOR']
            }

            this.userService.get(filters)
            .subscribe(
                users => {
                    this.supervisors = users;
                }
            );
        } else {
            // In sales-channels page, must filter users
            this.supervisors = this.getSupervisors();
        }

        this.userForm = this.fb.group({
            name: [(this.data.user) ? this.data.user.name : ''],
            lastName: [(this.data.user) ? this.data.user.lastName : ''],
            email: [(this.data.user) ? this.data.user.email : '' , Validators.email],
            documentId: [(this.data.user) ? this.data.user.documentId : ''],
            profiles : [(this.data.user) ? this.data.user.profiles : ''],
            roles : [(this.data.user) ? this.data.user.roles : ''],
            phone: [(this.data.user) ? this.data.user.phone : ''],
            supervisor: [(this.data.user && this.data.user.supervisor) ? this.data.user.supervisor._id : null]
        });
    }

    get f() { return this.userForm.controls; }

    closeDialog() {
        this.dialogRef.close();
    }

    submitForm() {
        if(this.userForm.valid) {
            if(!this.data.user){
                this.isSubmitting = true;
                let user: User = this.userForm.value;
                if(this.inSalesChannel || !this.canChooseProfile) {
                    user.userCompany = this.data.company._id;
                    user.profiles = ['COMERCIAL'];
                }
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
                    this.data.user.email = this.data.user.email.toLowerCase();
                    this.userService.update(this.data.user)
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

    private getSupervisors() {
        let result = [];
        for (let i = 0; i < this.data.company.users.length; i++) {
            if(this.hasCommonElement(this.data.company.users[i].roles, ['SUPERVISOR', 'LIDER'])) {
                result.push(this.data.company.users[i]);
            }
        }
        return result;
    }

    private hasCommonElement(arr1, arr2) {
        var bExists = false;
        $.each(arr2, function(index, value){

            if($.inArray(value,arr1)!=-1){
                bExists = true;
            }

            if(bExists){
                return false;
            }
        });
        return bExists;
    }

    private dataChanged(): boolean {
        let result = false;
        const controls = this.userForm.controls
        for (const control in controls) {
            if (controls.hasOwnProperty(control)) {
                let doChange = false;
                if((this.data.user[control] != controls[control].value)) {
                    doChange = true;

                    if(control == 'supervisor' && controls[control].value == '') {
                        doChange = false;
                    }
                }

                if(doChange) {
                    this.data.user[control] = controls[control].value;
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
