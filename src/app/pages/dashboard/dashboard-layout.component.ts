import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationCancel, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FaqsComponent } from './faqs/faqs.component';

import { AuthService } from '../../auth/auth.service';
import { LoaderService } from '../../core/loader/loader.service';
  
@Component({
    selector: 'app-dashboard-layout',
    templateUrl: './dashboard-layout.component.html',
    styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {
    private userSubscription: Subscription;
    user: any;
    loading: any;
    navItems: any;
    state: string = 'default';
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    toggleHamburger: boolean = false;
    
    @ViewChild('sidenav') sidenav: any;

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        public dialog: MatDialog,
        private loaderService: LoaderService
    ) {
        this.loading = false;
    }

    ngOnInit() {
        // update this.user after login/register/logout
        this.userSubscription = this.authService.userSource.subscribe(
            (user) => { this.user = user; }
        );

        this.route.data.subscribe(
            data => {
                this.navItems = data.cards;
                this.loaderService.hide();
            }
        )
    }

    ngAfterViewInit() {
        this.router.events.subscribe(
            (event) => {
                if(event instanceof NavigationStart) {
                    this.loading = true;
                } else if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
                    this.loading = false;
                }
            }
        );
    }

    faqs() {
        const dialogRef = this.dialog.open(FaqsComponent, {
            height: '96%',
            width: '50%',
        });;
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    profile() {
        const dialogRef = this.dialog.open(UserProfileComponent, {
            height: '96%',
            width: '50%',
        });;
        dialogRef.afterClosed().subscribe(result => {
            if(typeof result !== 'undefined') {
                this.user.name = result.name;
                this.user.lastName = result.lastName;
                this.user.email = result.email;
                this.user.phone = result.phone;
            }
        });
    }

    logout(): void {
        this.authService.signOut();
        this.navigate('');
    }

    navigate(link): void {
        this.router.navigate([link]);
    }

    ngOnDestroy() {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    toggleSidenav() {
        (this.toggleHamburger) ? this.toggleHamburger = false : this.toggleHamburger = true;
        this.sidenav.toggle();
    }
}
