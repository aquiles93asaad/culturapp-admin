import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
// import { SelectionModel } from '@angular/cdk/collections';
import { GenericDemoModalComponent } from './generic-demo-modal/generic-demo-modal.component';
import { GenericDemo, TableColumn, TableAction, Breadcrumb, Filter } from '../../core/models';
import { GenericDemoService } from '../../core/services';

@Component({
    selector: 'app-generic-demos',
    templateUrl: './generic-demos.component.html',
    styleUrls: ['./generic-demos.component.scss']
})
export class GenericDemosComponent implements OnInit {
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    genericDemos: MatTableDataSource<GenericDemo>;
    // tableSelection = new SelectionModel<GenericDemo>(true, []);
    showLoader: boolean = false;

    columns: TableColumn[] = [
        { name: 'name', label: 'Nombre', type: 'string', roles: ['ALL'] },
        { name: 'description', label: 'Descripción', type: 'string', roles: ['ALL'] },
        { name: 'createdBy', subName: 'name', alternateName: 'lastName', label: 'Creado por', type: 'string', roles: ['ALL'] },
        { name: 'createdAt', label: 'Creación', type: 'date', roles: ['ALL'] },
        { name: 'modifiedBy', subName: 'name', alternateName: 'lastName', label: 'Modificado por', type: 'string', roles: ['ALL'] },
        { name: 'modifiedAt', label: 'Última modificación', type: 'date', roles: ['ALL'] },
        { name: 'actions', label: 'Acciones', type: 'action', roles: ['ALL'] }
    ];

    actions: TableAction[] = [
        { name: 'edit', label: 'Editar', icon: 'edit'},
        // { name: 'delete', label: 'Eliminar', icon: 'delete'},
    ];

    breadcrumbs: Breadcrumb[] = [
        { text: 'Inicio', href: '/dashboard/inicio' },
        { text: 'Demos genericas', href: '/dashboard/demos-genericas' }
    ];

    filters: Filter[] = [
        { name: 'name', type: 'string', condition: 'contains', placeholder: 'Filtrar por nombre y/o descripción', advanceSearch: false , hint: 'Palabras enteras' }
    ];

    constructor(
        private _route: ActivatedRoute,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private genericDemoService: GenericDemoService,
        private changeDetectorRefs: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this._route.data.subscribe(
            data => {
                this.genericDemos = new MatTableDataSource<GenericDemo>(data.genericDemos);
            }
        )
    }

    genericDemosActions(actionData) {
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

    openDialog(genericDemo?: GenericDemo) {
        const dialogRef = this.dialog.open(GenericDemoModalComponent, {
            height: '90%',
            width: '60%',
            data: genericDemo
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if(typeof result !== 'undefined') {
                    this.refresh({});
                    if(genericDemo)
                        this.showMessage('La demo fue modificado correctamente');
                    else
                        this.showMessage('La demo fue creada correctamente');
                }
            }
        );
    }

    private refresh(filters) {
        this.showLoader = true;
        this.genericDemoService.get(filters)
        .subscribe(
            genericDemos => {
                this.genericDemos = new MatTableDataSource<GenericDemo>(genericDemos);
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
