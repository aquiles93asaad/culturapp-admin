import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
// import { SelectionModel } from '@angular/cdk/collections';
import { UserModalComponent, CompanyModalComponent, ConfirmDeleteModalComponent } from '../../shared/components';
import { User, Company, TableColumn, TableAction, Breadcrumb, Filter } from '../../core/models';
import { CompanyService, UserService } from '../../core/services';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sales-channels',
    templateUrl: './sales-channels.component.html',
    styleUrls: ['./sales-channels.component.scss']
})
export class SalesChannelsComponent implements OnInit {
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    salesChannels: MatTableDataSource<Company>;
    // tableSelection = new SelectionModel<Company>(true, []);
    showLoader: boolean = false;
    private userSubscription: Subscription;

    columns: TableColumn[] = [
        { name: 'name', label: 'Nombre', type: 'string', roles: ['ALL'] },
        { name: 'salesChannelOf', subName: 'name', label: 'Canal de', type: 'string', roles: ['ALL'] },
        { name: 'country', label: 'País', type: 'string', roles: ['ALL'] },
        { name: 'phone', label: 'Télefono', type: 'string', roles: ['ALL'] },
        { name: 'type', label: 'Tamaño', type: 'enum', enumValues: {big: 'Grande', medium: 'Mediana', small: 'Chica'}, roles: ['ALL'] },
        { name: 'origin', label: 'Presencia', type: 'enum', enumValues: {national: 'Nacional', international: 'Internacional'}, roles: ['ALL'] },
        { name: 'industry', label: 'Industria', type: 'string', roles: ['ALL'] },
        { name: 'employeesCount', label: 'Cantidad empleados', type: 'string', roles: ['ALL'] },
        { name: 'anualBilling', label: 'Facturación Anual', type: 'string', roles: ['ALL'] },
        { name: 'actions', label: 'Acciones', type: 'action', roles: ['ALL'] }
    ];

    actions: TableAction[] = [
        { name: 'edit-sales-channel', label: 'Editar canal de venta', icon: 'edit', color: 'primary'},
        { name: 'new-user', label: 'Agregar usuario a canal de venta', icon: 'person_add', color: 'primary'},
        // { name: 'delete-sales-channel', label: 'Eliminar canal de venta', icon: 'delete', color: 'primary'}
    ];

    breadcrumbs: Breadcrumb[] = [
        { text: 'Inicio', href: '/dashboard/inicio' },
        { text: 'Canales de venta', href: '/dashboard/canales-de-venta' }
    ];

    detailListColumns: TableColumn[] = [
        { name: 'name', label: 'Nombre', type: 'string', roles: ['ALL'] },
        { name: 'lastName', label: 'Apellido', type: 'string', roles: ['ALL'] },
        { name: 'email', label: 'Email', type: 'string', roles: ['ALL'] },
        { name: 'phoneNumber', label: 'Tel/Cel', type: 'number', roles: ['ALL'] },
        { name: 'roles', label: 'Roles', type: 'enum', enumValues: { EMPLEADO: 'Empleado', SUPERVISOR: 'Supervisor', LIDER: 'Líder'}, roles: ['ALL'] },
        { name: 'actions', label: 'Acciones', type: 'action', roles: ['ALL'] }
    ];

    detailListActions: TableAction[] = [
        { name: 'edit-user', label: 'Editar usuario', icon: 'edit', color: 'primary'},
        // { name: 'delete-user', label: 'Eliminar usuario', icon: 'delete', color: 'accent'}
    ];

    filters: Filter[] = [
        { name: 'name', type: 'string', condition: 'contains', placeholder: 'Filtrar por nombre', advanceSearch: false , hint: 'Nombre entero' }
    ];

    constructor(
        private _route: ActivatedRoute,
        public dialog: MatDialog,
        private snackBar: MatSnackBar,
        private changeDetectorRefs: ChangeDetectorRef,
        private companyService: CompanyService,
        private userService: UserService,
        private authService: AuthService
    ) { }
    
    ngOnInit() {
        this._route.data.subscribe(
            data => {
                this.salesChannels = new MatTableDataSource<Company>(data.salesChannels);
            }
        )

        let user = null;
        if (typeof (<any>window).user === 'undefined' || (<any>window).user == null) {
            // update this.user after login/register/logout
            this.userSubscription = this.authService.userSource.subscribe(
                (user) => { user = user; }
            );
        } else {
            user = (<any>window).user;
        }
        
    }

    salesChannelsActions(actionData) {
        if(actionData.action == 'edit-sales-channel') {
            this.openCompanyDialog(actionData.element);
        }

        if(actionData.action == 'delete-sales-channel') {
            this.openDeleteDialog('Eliminar este canal de venta eliminaría todos los usuarios relacionados a dicha canal y las oportunidades creadas por estos últimos', 'El canal de venta se eliminó correctamente', actionData.element, actionData.parentElement);
        }

        if(actionData.action == 'new-user') {
            this.openUserDialog(actionData.element);
        }
        
        if(actionData.action == 'edit-user') {
            this.openUserDialog(actionData.parentElement, actionData.element);
        }

        if(actionData.action == 'delete-user') {
            this.openDeleteDialog('Eliminar este usuario eliminaría todas las oportunidades creadas por el mismo', 'El usuario se eliminó correctamente', actionData.element, actionData.parentElement);
        }

        if(actionData.action == 'filter') {
            this.refresh(actionData.value);
        }
    }

    openCompanyDialog(company?: Company) {
        const dialogRef = this.dialog.open(CompanyModalComponent, {
            height: '96%',
            width: '50%',
            data: company
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if(typeof result !== 'undefined') {
                    this.refresh({});
                    if(company)
                        this.showMessage('El canal de venta fue modificado correctamente');
                    else
                        this.showMessage('El canal de venta fue creado correctamente');
                }
            }
        );
    }

    private openUserDialog(saleChannel: Company, saleChannelUser?: User) {
        const data = {
            company: saleChannel,
            user: saleChannelUser
        };
        
        const dialogRef = this.dialog.open(UserModalComponent, {
            height: '90%',
            width: '60%',
            data: data
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if(typeof result !== 'undefined') {
                    this.refresh({});
                    if(saleChannelUser)
                        this.showMessage('El usuario fue modificado correctamente');
                    else
                        this.showMessage('El usuario fue creado correctamente');
                }
            }
        );
    }

    private openDeleteDialog(message: string, snackMessage: string, element: any, parentElement: any) {
        const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, {
            height: '40%',
            width: '40%',
            data: message
        });
        dialogRef.beforeClose().subscribe(
            result => {
                if(result) {
                    if(parentElement) {
                        this.companyService.remove(element)
                        .subscribe(

                        )
                    } else {
                        this.userService.remove(element)
                        .subscribe(

                        )
                    }

                    this.showMessage(snackMessage);
                }
            }
        );
    }

    private refresh(filters) {
        this.showLoader = true;
        const userComapny = (<any>window).user.userCompany;
        let companiesIds = [];
        if(userComapny.salesChannels && userComapny.salesChannels.length != 0) {
            for (let i = 0; i < userComapny.salesChannels.length; i++) {
                companiesIds.push(userComapny.salesChannels[i]._id);
            }
        }
        companiesIds.push(userComapny._id);
        filters['salesChannelOf'] = { $in: companiesIds };
        this.companyService.get(filters)
        .subscribe(
            companies => {
                this.salesChannels = new MatTableDataSource<Company>(companies);
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
