import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
// import { SelectionModel } from '@angular/cdk/collections';
import { CursosModalComponent } from './cursos-modal/cursos-modal.component';
import { Breadcrumb, TableColumn, TableAction, Curso, Filter } from '../../core/models';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from '../../core/services'

@Component({
    selector: 'app-cursos',
    templateUrl: './cursos.component.html',
    styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit {
    cursos: MatTableDataSource<Curso>;
    showLoader: boolean = false;

    columns: TableColumn[] = [
        { name: 'nombre', label: 'Nombre', type: 'string', roles: ['ALL'] },
        { name: 'fechaInicio', label: 'Fecha Inicio', type: 'date', roles: ['ALL'] },
        { name: 'fechaFin', label: 'Fecha Fin', type: 'date', roles: ['ALL'] },
        { name: 'precio', label: 'Precio', type: 'number', roles: ['ALL'] },
        { name: 'profesor', label: 'Profesor/es', type: 'string', roles: ['ALL'] },
        { name: 'actions', label: 'Acciones', type: 'action', roles: ['ALL'] }
	];
	
	actions: TableAction[] = [
        { name: 'edit', label: 'Editar', icon: 'edit'}
    ];

	breadcrumbs: Breadcrumb[] = [
        { text: 'Inicio', href: '/dashboard/inicio' },
        { text: 'Cursos', href: '/dashboard/cursos' }
    ];

    filters: Filter[] = [
        { name: 'name', type: 'string', condition: 'contains', placeholder: 'Filtrar por nombre', advanceSearch: false , hint: 'Palabras enteras' }
    ];

    constructor(
        public dialog : MatDialog,
        private _route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private cursoService: CursoService,
        private changeDetectorRefs: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this._route.data.subscribe(
            data => {
                this.cursos = new MatTableDataSource<Curso>(data.cursos);
            }
        )
    }

    cursosActions(actionData) {
        if(actionData.action == 'edit') {
            this.openCursoModal(actionData.element);
        }

        if(actionData.action == 'filter') {
            this.refresh(actionData.value);
        }
    }

    openCursoModal(curso?: Curso) {
        const dialogRef = this.dialog.open(CursosModalComponent, {
            height: '96%',
            width: '50%',
            data: curso
        });;
        dialogRef.afterClosed().subscribe(
            result => {
                if(typeof result !== 'undefined') {
                    this.refresh({});
                    if(curso)
                        this.showMessage('La curso fue modificada correctamente');
                    else
                        this.showMessage('La curso fue creada correctamente');
                }
        });
    }

    private refresh(filters) {
        this.showLoader = true;
        this.cursoService.get(filters)
        .subscribe(
            cursos => {
                this.cursos = new MatTableDataSource<Curso>(cursos);
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