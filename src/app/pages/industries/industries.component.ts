import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
// import { SelectionModel } from '@angular/cdk/collections';
import { IndustriesModalComponent } from './industries-modal/industries-modal.component';
import { Breadcrumb, TableColumn, TableAction, Industry, Filter } from '../../core/models';
import { ActivatedRoute } from '@angular/router';
import { IndustryService } from '../../core/services'

@Component({
    selector: 'app-industries',
    templateUrl: './industries.component.html',
    styleUrls: ['./industries.component.scss']
})
export class IndustriesComponent implements OnInit {
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    industries: MatTableDataSource<Industry>;
    // tableSelection = new SelectionModel<Industry>(true, []);
    showLoader: boolean = false;

    columns: TableColumn[] = [
        { name: 'name', label: 'Nombre', type: 'string', roles: ['ALL'] },
        { name: 'description', label: 'Descripcion', type: 'string', roles: ['ALL'] },
        { name: 'actions', label: 'Acciones', type: 'action', roles: ['ALL'] }
	];
	
	actions: TableAction[] = [
        { name: 'edit', label: 'Editar', icon: 'edit'}
    ];

	breadcrumbs: Breadcrumb[] = [
        { text: 'Inicio', href: '/dashboard/inicio' },
        { text: 'Canales de venta', href: '/dashboard/industrias' }
    ];

    filters: Filter[] = [
        { name: 'name', type: 'string', condition: 'contains', placeholder: 'Filtrar por nombre y/o descripción', advanceSearch: false , hint: 'Palabras enteras' }
    ];

    constructor(
        public dialog : MatDialog,
        private _route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private industryService :IndustryService,
        private changeDetectorRefs: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this._route.data.subscribe(
            data => {
                this.industries = new MatTableDataSource<Industry>(data.industries);
            }
        )
    }

    industriesActions(actionData) {
        if(actionData.action == 'edit') {
            this.openIndustryModal(actionData.element);
        }

        if(actionData.action == 'filter') {
            this.refresh(actionData.value);
        }
    }

    openIndustryModal(industry?: Industry) {
        const dialogRef = this.dialog.open(IndustriesModalComponent, {
            height: '96%',
            width: '50%',
            data: industry
        });;
        dialogRef.afterClosed().subscribe(
            result => {
                if(typeof result !== 'undefined') {
                    this.refresh({});
                    if(industry)
                        this.showMessage('La industria fue modificada correctamente');
                    else
                        this.showMessage('Una industria fue creada correctamente');
                }
        });
    }

    private refresh(filters) {
        this.showLoader = true;
        this.industryService.get(filters)
        .subscribe(
            industries => {
                this.industries = new MatTableDataSource<Industry>(industries);
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