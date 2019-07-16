import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
// import { SelectionModel } from '@angular/cdk/collections';
import { ProfesoresModalComponent } from './profesores-modal/profesores-modal.component';
import { Breadcrumb, TableColumn, TableAction, User, Filter } from '../../core/models';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services'

@Component({
    selector: 'app-profesores',
    templateUrl: './profesores.component.html',
    styleUrls: ['./profesores.component.scss']
})
export class ProfesoresComponent implements OnInit {

    profesores: MatTableDataSource<User>;
    showLoader: boolean = false;

    columns: TableColumn[] = [
        { name: 'nombre', label: 'Nombre', type: 'string', roles: ['ALL'] },
        { name: 'apellido', label: 'Apellido', type: 'string', roles: ['ALL'] },
        { name: 'email', label: 'Email', type: 'string', roles: ['ALL'] },
        { name: 'actions', label: 'Acciones', type: 'action', roles: ['ALL'] }
    ];

    actions: TableAction[] = [
        { name: 'edit', label: 'Editar', icon: 'edit' }
    ];

    breadcrumbs: Breadcrumb[] = [
        { text: 'Inicio', href: '/dashboard/inicio' },
        { text: 'Profesores', href: '/dashboard/profesores' }
    ];

    filters: Filter[] = [
        { name: 'name', type: 'string', condition: 'contains', placeholder: 'Filtrar por nombre', advanceSearch: false, hint: 'Palabras enteras' }
    ];

    constructor(
        public dialog: MatDialog,
        private _route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private userService: UserService,
        private changeDetectorRefs: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this._route.data.subscribe(
            data => {
                this.profesores = new MatTableDataSource<User>(data.profesores);
            }
        )
    }

    profesoresActions(actionData) {
        if (actionData.action == 'edit') {
            this.openProfesoresModal(actionData.element);
        }

        if (actionData.action == 'filter') {
            this.refresh(actionData.value);
        }
    }

    openProfesoresModal(user?: User) {
        const dialogRef = this.dialog.open(ProfesoresModalComponent, {
            height: '96%',
            width: '50%',
            data: user
        });;
        dialogRef.afterClosed().subscribe(
            result => {
                if (typeof result !== 'undefined') {
                    let filters = {
                        esProfesor: true,
                        centro: (<any>window).user.centro._id
                    };
                    this.refresh(filters);
                    if (user)
                        this.showMessage('El profesor fue modificado correctamente');
                    else
                        this.showMessage('El profesor fue creado correctamente');
                }
            });
    }

    private refresh(filters) {
        this.showLoader = true;
        this.userService.get(filters)
        .subscribe(
            profesores => {
                this.profesores = new MatTableDataSource<User>(profesores);
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