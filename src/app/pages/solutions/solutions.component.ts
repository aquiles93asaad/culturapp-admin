import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
// import { SelectionModel } from '@angular/cdk/collections';
import { SolutionModalComponent } from './solution-modal/solution-modal.component';
import { Solution, TableColumn, TableAction, Breadcrumb, Filter } from '../../core/models';
import { SolutionService } from '../../core/services'

@Component({
    selector: 'app-solutions-component',
    templateUrl: './solutions.component.html',
    styleUrls: ['./solutions.component.scss']
})
export class SolutionsComponent implements OnInit {
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    solutions: MatTableDataSource<Solution>;
    // tableSelection = new SelectionModel<Solution>(true, []);
    showLoader: boolean = false;

    columns: TableColumn[] = [
        { name: 'name', label: 'Nombre', type: 'string', roles: ['ALL'] },
        { name: 'description', label: 'Descripción', type: 'string', roles: ['ALL'] },
        { name: 'documentClassesCount', label: 'Cant. CD', type: 'number', roles: ['ALL'] },
        { name: 'hoursSmall', label: 'Horas empresa chica', type: 'string', roles: ['ALL'] },
        { name: 'hoursMedium', label: 'Horas empresa mediana', type: 'string', roles: ['ALL'] },
        { name: 'hoursBig', label: 'Horas empresa grande', type: 'number', roles: ['ALL'] },
        { name: 'actions', label: '', type: 'action', roles: ['ALL'] }
    ];

    actions: TableAction[] = [
        { name: 'edit', label: 'Editar', icon: 'edit' },
        // { name: 'delete', label: 'Eliminar', icon: 'delete' }
    ];

    breadcrumbs: Breadcrumb[] = [
        { text: 'Inicio', href: '/dashboard/inicio' },
        { text: 'Soluciones', href: '/dashboard/soluciones' }
    ];

    filters: Filter[] = [
        { name: 'name', type: 'string', condition: 'contains', placeholder: 'Filtrar por nombre y/o descripción', advanceSearch: false , hint: 'Palabras enteras' }
    ];

    constructor(
        private _route: ActivatedRoute,
        public dialog: MatDialog,
        private snackBar: MatSnackBar,
        private changeDetectorRefs: ChangeDetectorRef,
        private solutionService: SolutionService
    ) { }

    ngOnInit() {
        this._route.data.subscribe(
            data => {
                this.solutions = new MatTableDataSource<Solution>(data.solutions);
            }
        )
    }

    solutiosnActions(actionData) {
        if (actionData.action == 'edit') {
            this.openDialog(actionData.element);
        }

        if (actionData.action == 'delete') {
            this.openDialog(actionData.element);
        }

        if(actionData.action == 'filter') {
            this.refresh(actionData.value);
        }
    }

    openDialog(solution?: Solution) {
        const dialogRef = this.dialog.open(SolutionModalComponent, {
            height: '90%',
            width: '60%',
            data: solution
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if(typeof result !== 'undefined') {
                    this.refresh({});
                    if(solution)
                        this.showMessage('La solución fue modificado correctamente');
                    else
                        this.showMessage('La solución fue creado correctamente');
                }
            }
        );
    }

    private refresh(filters) {
        this.showLoader = true;
        filters['isGeneric'] = true;
        this.solutionService.get(filters)
        .subscribe(
            solutions => {
                this.solutions = new MatTableDataSource<Solution>(solutions);
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
