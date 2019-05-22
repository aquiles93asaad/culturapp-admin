import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
// import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { UserModalComponent } from '../../shared/components';
import { User, TableColumn, TableAction, Breadcrumb, Filter } from '../../core/models';
import { UserService } from '../../core/services';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-my-team-component',
    templateUrl: './my-team.component.html',
    styleUrls: ['./my-team.component.scss']
})
export class MyTeamComponent implements OnInit {
    private user: any;
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    users: MatTableDataSource<User>;
    // tableSelection = new SelectionModel<User>(true, []);
    showLoader: boolean = false;
    
    columns: TableColumn[] = [
        { name: 'name', label: 'Nombre', type: 'string', roles: ['ALL'] },
        { name: 'lastName', label: 'Apellido', type: 'string', roles: ['ALL'] },
        { name: 'documentId', label: 'DNI', type: 'string', roles: ['ALL'] },
        { name: 'email', label: 'Email', type: 'string', roles: ['ALL'] },
        { name: 'phone', label: 'Tel/Cel', type: 'number', roles: ['ALL'] },
        // { name: 'profiles', label: 'Perfiles', type: 'string', roles: ['ALL'] },
        { name: 'roles', label: 'Roles', type: 'enum', enumValues: { EMPLEADO: 'Empleado', SUPERVISOR: 'Supervisor', LIDER: 'Líder'}, roles: ['ALL'] },
        { name: 'actions', label: '', type: 'action', roles: ['ALL'] }
    ];

    actions: TableAction[] = [];

    breadcrumbs: Breadcrumb[] = [
        { text: 'Inicio', href: '/dashboard/inicio' },
        { text: 'Mi Equipo', href: '/dashboard/mi-equipo' }
    ];
    
    filters: Filter[] = [
        { name: 'fullName', type: 'string', condition: 'contains', placeholder: 'Filtrar por nombre y/o apellido', advanceSearch: false , hint: 'Nombres enteros' },
        { name: 'roles', type: 'select', condition: 'equal', placeholder: 'Rol', advanceSearch: false, options: [{ value: 'LIDER', label: 'Líder' }, { value: 'SUPERVISOR', label: 'Supervisor' }, { value: 'EMPLEADO', label: 'Empleado' }] }
    ];
    
    constructor(
        private _route: ActivatedRoute,
        public dialog: MatDialog,
        private snackBar: MatSnackBar,
        private changeDetectorRefs: ChangeDetectorRef,
        private userService: UserService,
        private authService: AuthService,
    ) { }
    
    ngOnInit() {
        this.authService.userSource.subscribe(
            (user) => {
                this.user = user;
                if(user && user.roles.includes('LIDER')) {
                    this.actions = [
                        { name: 'edit', label: 'Editar', icon: 'edit'},
                        // { name: 'delete', label: 'Eliminar', icon: 'delete'}
                    ];
                }
            }
        );

        this._route.data.subscribe(
            data => {
                this.users = new MatTableDataSource<User>(data.users);
            }
        )
    }    

    myTeamActions(actionData) {
        if(actionData.action == 'edit') {
            this.openDialog(actionData.element);
        }

        if(actionData.action == 'delete') {
            this.openDialog(actionData.element);
        }

        if(actionData.action == 'filter') {
            this.refresh(actionData.value);
        }
    }

    openDialog(user?: User) {
        const data = {
            company: (<any>window).user.userCompany,
            user: user
        };

        const dialogRef = this.dialog.open(UserModalComponent, {
            height: '90%',
            width: '60%',
            data: data
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if(typeof result !== 'undefined') {
                    this.refresh({});
                    if(user) {
                        this.showMessage('El usuario fue modificado correctamente');
                    } else {
                        (<any>window).user.userCompany.users.push(result._id);
                        this.showMessage('El usuario fue creado correctamente');
                    }
                }
            }
        );
    }

    private refresh(filters) {
        this.showLoader = true;
        filters['userCompany'] = (<any>window).user.userCompany._id;
        this.userService.get(filters)
        .subscribe(
            users => {
                this.users = new MatTableDataSource<User>(users);
                this.changeDetectorRefs.detectChanges();
            },
            error => {
                this.showMessage(error.statusText);
            },
            () => {
                this.showLoader = false;
            }
        );
    }

    private showMessage(message) {
        this.snackBar.open(message, '', {
            duration: 2000,
            panelClass: ['justify-content-center', 'd-flex', 'mb-3']
        });
    }
}
