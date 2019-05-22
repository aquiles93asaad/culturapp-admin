import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../shared/match-other.validator';

import { UserService } from '../../../core/services';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
    private user = (<any>window).user;
    profile: FormGroup;
    isSubmitting: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<UserProfileComponent>,
        private snackBar: MatSnackBar,
        private userProfileForm: FormBuilder,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.profile = this.userProfileForm.group({
            email: [this.user.email],
            name: [this.user.name],
            lastName: [this.user.lastName],
            phone: [this.user.phone],
            passwords: this.userProfileForm.group({
                password: [''],
                repeat: ['']
            }, {
                    validator: CustomValidators.Match('password', 'repeat')
                }),
        });
    }

    get passwords() { return this.profile.get('passwords')['controls']; }

    onNoClick(): void {
        this.dialogRef.close();
    }

    sumbitForm() {
        if(this.profile.valid) {
            this.isSubmitting = true;
            let user = this.profile.value;
            if(this.dataChanged(user)) {
                this.userService.update(user)
                .subscribe(
                    user => {
                        this.showMessage('Su perfil de usuario fue actualizado correctamente');
                        this.dialogRef.close(user);
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

    private dataChanged(user: any): boolean {
        const password = this.profile.get('passwords').get('password').value;
        delete user['passwords'];
        user.password = password;
        user._id = this.user._id;

        let result = false;
        for (const key in user) {
            if (user.hasOwnProperty(key)) {
                if(user[key] != this.user[key]) {
                    result = true;
                }

                if(key == 'password' && user[key] != '') {
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
