import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
// import { SelectionModel } from '@angular/cdk/collections';
import { Breadcrumb, TableColumn, TableAction, Asistencia, Filter } from '../../core/models';
import { ActivatedRoute } from '@angular/router';
import { AsistenciaService } from '../../core/services'

@Component({
    selector: 'app-asistencias',
  templateUrl: './asistencias.component.html',
  styleUrls: ['./asistencias.component.scss']
})
export class AsistenciasComponent implements OnInit {
    asistencias: MatTableDataSource<Asistencia>;
    showLoader: boolean = false;

    columns: TableColumn[] = [
        { name: 'curso', subName: 'nombre', label: 'Curso', type: 'string', roles: ['ALL'] },
        { name: 'fechaClase', label: 'Fecha', type: 'date', roles: ['ALL'] },
        { name: 'estado', label: 'Estado', type: 'string', roles: ['ALL'] },
        { name: 'esFeriado', label: 'Feriado', type: 'boolean', roles: ['ALL'] },
        { name: 'actions', label: 'Acciones', type: 'action', roles: ['ALL'] }
	];
	
	actions: TableAction[] = [
        // { name: 'edit', label: 'Editar', icon: 'edit'}
    ];

	breadcrumbs: Breadcrumb[] = [
        { text: 'Inicio', href: '/dashboard/inicio' },
        { text: 'Asistencias', href: '/dashboard/asistencias' }
    ];

    filters: Filter[] = [
        // { name: 'name', type: 'string', condition: 'contains', placeholder: 'Filtrar por nombre', advanceSearch: false , hint: 'Palabras enteras' }
    ];

    constructor(
        public dialog : MatDialog,
        private _route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private asistenciaService: AsistenciaService,
        private changeDetectorRefs: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this._route.data.subscribe(
            data => {
                this.asistencias = new MatTableDataSource<Asistencia>(data.asistencias);
            }
        )
    }

    asistenciasActions(actionData) {
        if(actionData.action == 'edit') {

        }

        if(actionData.action == 'filter') {
            this.refresh(actionData.value);
        }
    }

    private refresh(filters) {
        this.showLoader = true;
        this.asistenciaService.get(filters)
        .subscribe(
            asistencias => {
                this.asistencias = new MatTableDataSource<Asistencia>(asistencias);
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
