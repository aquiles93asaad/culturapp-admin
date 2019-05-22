import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { CompanyModalComponent } from '../../shared/components';
import { Company, TableColumn, TableAction, Breadcrumb, Filter } from '../../core/models';
import { CompanyService } from '../../core/services';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    clients: MatTableDataSource<Company>;
    // tableSelection = new SelectionModel<User>(true, []);
    showLoader: boolean = false;

    fabButtons: TableAction[] = [
        { name: 'new-user', label: 'Nuevo usuario de canal de venta', icon: 'person_add'},
        { name: 'new-company', label: 'Nueva empresa de canal de venta', icon: 'location_city'}
    ]

    columns: TableColumn[] = [
        { name: 'name', label: 'Nombre', type: 'string', roles: ['ALL'] },
        { name: 'country', label: 'País', type: 'string', roles: ['ALL'] },
        { name: 'phone', label: 'Télefono', type: 'string', roles: ['ALL'] },
        { name: 'type', label: 'Tamaño', type: 'string', roles: ['ALL'] },
        { name: 'origin', label: 'Presencia', type: 'number', roles: ['ALL'] },
        { name: 'industry', label: 'Industria', type: 'string', roles: ['ALL'] },
        { name: 'employeesCount', label: 'Cantidad empleados', type: 'string', roles: ['ALL'] },
        { name: 'anualBilling', label: 'Facturación Anual', type: 'string', roles: ['ALL'] },
        { name: 'actions', label: 'Acciones', type: 'action', roles: ['ALL'] }
    ];

    actions: TableAction[] = [
        { name: 'edit', label: 'Editar', icon: 'edit', color: 'primary'},
        // { name: 'delete', label: 'Eliminar', icon: 'delete', color: 'accent'}
    ];

    breadcrumbs: Breadcrumb[] = [
        { text: 'Inicio', href: '/dashboard/inicio' },
        { text: 'Clientes', href: '/dashboard/clientes' }
    ];

    filters: Filter[] = [
        { name: 'name', type: 'string', condition: 'contains', placeholder: 'Filtrar por nombre', advanceSearch: false , hint: 'Nombre entero' }
    ];

    constructor(
        private _route: ActivatedRoute,
        public dialog: MatDialog,
        private snackBar: MatSnackBar,
        private changeDetectorRefs: ChangeDetectorRef,
        private companyService: CompanyService
    ) { }

    openCompanyDialog(company?: Company) {
        const dialogRef = this.dialog.open(CompanyModalComponent, {
            height: '96%',
            width: '50%',
            data: company
        });
        dialogRef.afterClosed().subscribe(
            // Creación o update de un empresa
            result => {
                if(typeof result !== 'undefined') {
                    this.refresh({});
                    if(company) {
                        this.showMessage('El cliente "' +  company.name + '" fue modificado correctamente');
                    } else {
                        this.showMessage('El cliente "'  + result.name + '" fue creado correctamente.');
                    }
                }
            }
        );
    }

    ngOnInit() {
        this._route.data.subscribe(
            data => {
                this.clients = new MatTableDataSource<Company>(data.clients);
            }
        )
    }

    clientsActions(actionData) {
        if(actionData.action == 'edit') {
            this.openCompanyDialog(actionData.element);
        }

        // if(actionData.action == 'delete') {

        //}

        if(actionData.action == 'filter') {
            this.refresh(actionData.value);
        }
    }

    private refresh(filters) {
        this.showLoader = true;
        filters['isClient'] = true;
        this.companyService.get(filters)
        .subscribe(
            clients => {
                this.clients = new MatTableDataSource<Company>(clients);
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
