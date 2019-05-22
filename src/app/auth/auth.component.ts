import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../core/services';
import { AuthService } from './auth.service';
import { LoaderService } from '../core/loader/loader.service';
//import { CustomValidators } from '../shared/match-other.validator';

@Component({
    selector: 'app-auth-page',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    
    authForm: FormGroup;
    authType: string = '';
    header: string = '';
    submitBtnText: string = '';
    otherAcess: string = '';
    changeAccess: string = '';
    changeAccessBtn: string = '';
    changeAccessRoute: string = '';
    isSubmitting: boolean = false;
    errorMessage: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private userService: UserService,
        private loaderService: LoaderService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit() {
        this.route.url.subscribe(data => {
            // Get the last piece of the URL (it's either 'login' or 'register')
            this.authType = data[data.length - 1].path;
            
            // add form control for username if this is the register page
            // Set the strings for the page accordingly
            if (this.authType === 'register') {
                this.authForm = this.fb.group({
                    email: ['', [Validators.required, Validators.email]]
                }
                // , {
                //     validator: CustomValidators.Match('email', 'repeat')
                // }
                );

                this.header = 'Crear una cuenta';
                this.submitBtnText = 'Crear';
                this.otherAcess = 'o creá una con';
                this.changeAccess = 'Ya tenes cuenta?';
                this.changeAccessBtn = 'Ingresar';
                this.changeAccessRoute = '/login';
            } else {
                this.authForm = this.fb.group({
                    username: ['', Validators.required],
                    password: ['', Validators.required],
                    rememberMe: [true]
                });

                this.header = 'Ingresá a tu cuenta';
                this.submitBtnText = 'Ingresar';
                this.otherAcess = 'o ingresá con';
                this.changeAccess = 'Aún no tenes cuenta?';
                this.changeAccessBtn = 'Registrar';
                this.changeAccessRoute = '/register';
            }
        });
        this.loaderService.hide();
    }

    // convenience getter for easy access to form fields
    get f() { return this.authForm.controls; }

    submitForm() {
        if(this.authForm.valid) {
            if(this.authType == 'register') {
                this.userService.check(this.authForm.get('email').value.toLowerCase())
                    .subscribe(
                        data => {
                            if(!data) {
                                this.router.navigate(['/new-user'], { queryParams: { newUserEmail: this.authForm.get('email').value }, skipLocationChange: true });
                            } else {
                                this.authForm.get('email').setErrors({ userExists: true });
                            }
                        },
                        error => {
                            console.log(error);
                        }
                    )
            } else {
                this.isSubmitting = true;
        
                this.authService.login(this.authForm.get('username').value.toLowerCase(), this.authForm.get('password').value, this.authForm.get('rememberMe').value)
                    .subscribe(
                        user => {
                            this.router.navigateByUrl('/dashboard/inicio')
                        },
                        (error) => {
                            if(error.error == 'invalid-user') {
                                this.authForm.get('username').setErrors({ invalidUser: true });
                                this.errorMessage = error.statusText;
                            }

                            if(error.error == 'invalid-password') {
                                this.authForm.get('password').setErrors({ invalidPassword: true });
                                this.errorMessage = error.statusText;
                            }
                            this.isSubmitting = false;
                        }
                    );
            }
        }
    }
}
