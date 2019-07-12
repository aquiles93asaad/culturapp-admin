import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { concatMap } from 'rxjs/operators';

import { UserService } from '../../core/services';
import { AuthService } from '../auth.service';

import { User } from '../../core/models';
import { CustomValidators } from '../../shared/match-other.validator';

@Component({
    selector: 'app-register-page',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    
    title: string = 'Mi empresa digital';
    subtitle: string = 'Registro empresa';
    next: string = 'Siguiente';
    step: number = 50;
    firstForm: FormGroup;
    secondForm: FormGroup;
    newUserEmail: string;
    isSubmitting: boolean = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        public snackBar: MatSnackBar,
        private authService: AuthService,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.route.queryParams
            .subscribe(
                params => {
                    if( params['newUserEmail'] ){
                        this.newUserEmail = params['newUserEmail'];
                    }else{
                        this.router.navigate(['/register']);
                    }
                    
                }
            );
        this.initFirstForm();
        this.initSecondForm();
    }

    // convenience getter for easy access to form fields
    get f1() { return this.firstForm.controls; }
    get f2() { return this.secondForm.controls; }
    get passwords() { return this.secondForm.get('passwords')['controls']; }

    stepBack() {
        if (this.step == 100){
        this.subtitle = 'Registro empresa';
        this.step = 50;
        }else if (this.step == 50) {
            this.router.navigate(['/register']);
        }
    }

    sumbitFistForm() {
        if(this.firstForm.valid) {
            this.isSubmitting = true;
            // this.companyService.check(this.firstForm.get('name').value, this.firstForm.get('cuit').value)
            // .subscribe(
            //     data => {
            //         if(!data) {
            //             this.subtitle = 'Registro usuario';
            //             this.step = 100;
            //         } else {
            //             this.firstForm.get('name').setErrors({ companyExists: true });
            //         }
                    
            //     },
            //     error => {
            //         console.log(error);
            //     },
            //     () => {
            //         this.isSubmitting = false;
            //     }
            // )
        }
    }

    sumbitSecondForm() {
        if(this.secondForm.valid) {
            this.isSubmitting = true;
            let user: User = this.secondForm.value;
            this.processUserData(user);
            this.userService.check(user.email).pipe(
                concatMap( (userExists) => {
                    if(userExists) {
                        this.firstForm.get('email').setErrors({ userExists: true });
                        return null;
                    }
    
                    return this.authService.register(user)
                } )
            ).subscribe(
                data => {
                    this.showMessage('El usuario y la empresa fueron creados correctamente');
                    setTimeout(() => {
                        this.router.navigate(['/dashboard/inicio']);
                    }, 2000);
                }, 
                error => {
                    console.log(error);
                    this.showMessage(error);
                },
                () => {
                    this.isSubmitting = false;
                }
            )
        }
    }

    /* PRIVATE METHODS */
    private initFirstForm() {
        this.firstForm = this.fb.group({
            name: ['', Validators.required],
            cuit: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
            phone: [''],
            address: [''],
            website: [''],
            quantity: ['']
        });
    }

    private initSecondForm() {
        this.secondForm = this.fb.group({
            email: [{ value: this.newUserEmail, disabled: true}],
            passwords: this.fb.group({
                password: ['', Validators.required],
                repeat: ['', Validators.required]
            }, {
                    validator: CustomValidators.Match('password', 'repeat')
                }),
            name: ['', Validators.required],
            lastName: ['', Validators.required],
            documentId: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
            phone: ['']
        });
    }

    private processUserData(user) {
        user.email = this.newUserEmail;
        user.password = user.passwords.password;
        delete user['passwords'];
    }

    private showMessage(message) {
        this.snackBar.open(message, '', {
            duration: 2000,
            panelClass: ['justify-content-center', 'd-flex', 'mb-3']
        });
    }
}