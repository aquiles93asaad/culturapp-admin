import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
// import { SelectionModel } from '@angular/cdk/collections';
import { CentrosModalComponent } from './centros-modal/centros-modal.component';
import { Breadcrumb, TableColumn, TableAction, Centro, Filter } from '../../core/models';
import { ActivatedRoute } from '@angular/router';
import { CentroService } from '../../core/services'

@Component({
    selector: 'app-centros',
    templateUrl: './centros.component.html',
    styleUrls: ['./centros.component.scss']
})
export class CentrosComponent implements OnInit {
    centros: MatTableDataSource<Centro>;
    showLoader: boolean = false;

    columns: TableColumn[] = [
        { name: 'nombre', label: 'Nombre', type: 'string', roles: ['ALL'] },
        { name: 'direccion', label: 'Dirección', type: 'string', roles: ['ALL'] },
        { name: 'actions', label: 'Acciones', type: 'action', roles: ['ALL'] }
	];
	
	actions: TableAction[] = [
        { name: 'edit', label: 'Editar', icon: 'edit'}
    ];

	breadcrumbs: Breadcrumb[] = [
        { text: 'Inicio', href: '/dashboard/inicio' },
        { text: 'Centros', href: '/dashboard/centros' }
    ];

    filters: Filter[] = [
        { name: 'name', type: 'string', condition: 'contains', placeholder: 'Filtrar por nombre', advanceSearch: false , hint: 'Palabras enteras' }
    ];

    constructor(
        public dialog : MatDialog,
        private _route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private centroService: CentroService,
        private changeDetectorRefs: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this._route.data.subscribe(
            data => {
                this.centros = new MatTableDataSource<Centro>(data.centros);
            }
        )
    }

    centrosActions(actionData) {
        if(actionData.action == 'edit') {
            this.openCentroModal(actionData.element);
        }

        if(actionData.action == 'filter') {
            this.refresh(actionData.value);
        }
    }

    openCentroModal(centro?: Centro) {
        const dialogRef = this.dialog.open(CentrosModalComponent, {
            height: '96%',
            width: '50%',
            data: centro
        });;
        dialogRef.afterClosed().subscribe(
            result => {
                if(typeof result !== 'undefined') {
                    this.refresh({});
                    if(centro)
                        this.showMessage('El centro modificada correctamente');
                    else
                        this.showMessage('El centro fue creada correctamente');
                }
        });
    }

    private refresh(filters) {
        this.showLoader = true;
        this.centroService.get(filters)
        .subscribe(
            centros => {
                this.centros = new MatTableDataSource<Centro>(centros);
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