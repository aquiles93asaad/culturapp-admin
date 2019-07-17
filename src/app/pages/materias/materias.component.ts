import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
// import { SelectionModel } from '@angular/cdk/collections';
import { MateriasModalComponent } from './materias-modal/materias-modal.component';
import { Breadcrumb, TableColumn, TableAction, Materia, Filter } from '../../core/models';
import { ActivatedRoute } from '@angular/router';
import { MateriaService } from '../../core/services'

@Component({
    selector: 'app-materias',
    templateUrl: './materias.component.html',
    styleUrls: ['./materias.component.scss']
})
export class MateriasComponent implements OnInit {
    materias: MatTableDataSource<Materia>;
    showLoader: boolean = false;

    columns: TableColumn[] = [
        { name: 'nombre', label: 'Nombre', type: 'string', roles: ['ALL'] },
        { name: 'descripcion', label: 'Descripción', type: 'string', roles: ['ALL'] },
        { name: 'actions', label: 'Acciones', type: 'action', roles: ['ALL'] }
	];
	
	actions: TableAction[] = [
        { name: 'edit', label: 'Editar', icon: 'edit'}
    ];

	breadcrumbs: Breadcrumb[] = [
        { text: 'Inicio', href: '/dashboard/inicio' },
        { text: 'Categorias de cursos', href: '/dashboard/materias' }
    ];

    filters: Filter[] = [
        { name: 'name', type: 'string', condition: 'contains', placeholder: 'Filtrar por nombre', advanceSearch: false , hint: 'Palabras enteras' }
    ];

    constructor(
        public dialog : MatDialog,
        private _route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private materiaService: MateriaService,
        private changeDetectorRefs: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this._route.data.subscribe(
            data => {
                this.materias = new MatTableDataSource<Materia>(data.materias);
            }
        )
    }

    materiasActions(actionData) {
        if(actionData.action == 'edit') {
            this.openMateriaModal(actionData.element);
        }

        if(actionData.action == 'filter') {
            this.refresh(actionData.value);
        }
    }

    openMateriaModal(materia?: Materia) {
        const dialogRef = this.dialog.open(MateriasModalComponent, {
            height: '96%',
            width: '50%',
            data: materia
        });;
        dialogRef.afterClosed().subscribe(
            result => {
                if(typeof result !== 'undefined') {
                    this.refresh({});
                    if(materia)
                        this.showMessage('La materia fue modificada correctamente');
                    else
                        this.showMessage('La materia fue creada correctamente');
                }
        });
    }

    private refresh(filters) {
        this.showLoader = true;
        this.materiaService.get(filters)
        .subscribe(
            materias => {
                this.materias = new MatTableDataSource<Materia>(materias);
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