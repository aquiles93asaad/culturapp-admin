import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
// import { SelectionModel } from '@angular/cdk/collections';
import { UserModalComponent } from '../../shared/components';
import { Breadcrumb, TableColumn, TableAction, User, Filter } from '../../core/models';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services'

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

    users: MatTableDataSource<User>;
    showLoader: boolean = false;

    columns: TableColumn[] = [
        { name: 'nombre', label: 'Nombre', type: 'string', roles: ['ALL'] },
        { name: 'apellido', label: 'Apellido', type: 'string', roles: ['ALL'] },
        { name: 'email', label: 'Email', type: 'string', roles: ['ALL'] },
        { name: 'actions', label: 'Acciones', type: 'action', roles: ['ALL'] }
	];
	
	actions: TableAction[] = [
        { name: 'edit', label: 'Editar', icon: 'edit'}
    ];

	breadcrumbs: Breadcrumb[] = [
        { text: 'Inicio', href: '/dashboard/inicio' },
        { text: 'Usuarios', href: '/dashboard/usuarios' }
    ];

    filters: Filter[] = [
        { name: 'name', type: 'string', condition: 'contains', placeholder: 'Filtrar por nombre', advanceSearch: false , hint: 'Palabras enteras' }
    ];

    constructor(
        public dialog : MatDialog,
        private _route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private userService: UserService,
        private changeDetectorRefs: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this._route.data.subscribe(
            data => {
                this.users = new MatTableDataSource<User>(data.users);
            }
        )
    }

    usersActions(actionData) {
        if(actionData.action == 'edit') {
            this.openUserModal(actionData.element);
        }

        if(actionData.action == 'filter') {
            this.refresh(actionData.value);
        }
    }

    openUserModal(user?: User) {
        const dialogRef = this.dialog.open(UserModalComponent, {
            height: '96%',
            width: '50%',
            data: user
        });;
        dialogRef.afterClosed().subscribe(
            result => {
                if(typeof result !== 'undefined') {
                    this.refresh({});
                    if(user)
                        this.showMessage('El usuario fue modificado correctamente');
                    else
                        this.showMessage('El usuario fue creado correctamente');
                }
        });
    }

    private refresh(filters) {
        this.showLoader = true;
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