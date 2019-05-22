import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
// import { SelectionModel } from '@angular/cdk/collections';
import { ConstantsModalComponent } from './constants-modal/constants-modal.component';
import { Constants, TableColumn, TableAction, Breadcrumb } from '../../core/models';
import { ConstantsService } from '../../core/services';

@Component({
    selector: 'app-constants',
    templateUrl: './constants.component.html',
    styleUrls: ['./constants.component.scss']
})
export class ConstantsComponent implements OnInit {
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    constants: MatTableDataSource<Constants>;
    // tableSelection = new SelectionModel<Constants>(true, []);
    showLoader: boolean = false;

    columns: TableColumn[] = [
        { name: 'thubanLicense', label: 'Lic. Thuban', type: 'string', roles: ['ALL'] },
        { name: 'capitkaLicense', label: 'Lic. Captika', type: 'string', roles: ['ALL'] },
        { name: 'hourValue', label: 'Valor hora', type: 'string', roles: ['ALL'] },
        { name: 'thubanMaintenance', label: 'Mant. Lic. Thuban', type: 'string', roles: ['ALL'] },
        { name: 'captikaMaintenance', label: 'Mant. Lic. Captika', type: 'number', roles: ['ALL'] },
        { name: 'createdBy', subName: 'name', alternateName: 'lastName', label: 'Creado por', type: 'string', roles: ['ALL'] },
        { name: 'createdAt', label: 'Creación', type: 'date', roles: ['ALL'] },
        { name: 'isActive', label: 'Activo', type: 'boolean', roles: ['ALL'] },
        { name: 'actions', label: 'Acciones', type: 'action', roles: ['ALL'] }
    ];

    actions: TableAction[] = [
        { name: 'see', label: 'Ver todos los valores', icon: 'visibility'},
        { name: 'set-active', label: 'Activar valores', icon: 'done'}
    ];

    breadcrumbs: Breadcrumb[] = [
        { text: 'Inicio', href: '/dashboard/inicio' },
        { text: 'Constantes de calculo de propuestas', href: '/dashboard/constantes' }
    ];

    constructor(
        private _route: ActivatedRoute,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private constantsService: ConstantsService,
        private changeDetectorRefs: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this._route.data.subscribe(
            data => {
                this.constants = new MatTableDataSource<Constants>(data.constants);
            }
            
        )
    }

    constantsActions(actionData) {
        if(actionData.action == 'see') {
            this.openDialog(actionData.element);
        }

        if(actionData.action == 'set-active') {
            this.chooseConstants(actionData.element);
        }
    }

    openDialog(constants?: Constants) {
        const dialogRef = this.dialog.open(ConstantsModalComponent, {
            height: '90%',
            width: '60%',
            data: constants
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if(typeof result !== 'undefined') {
                    this.refresh();
                    if(constants)
                        this.showMessage('Los valores fueron modificados correctamente');
                    else
                        this.showMessage('Una instancia de valores fue creada correctamente');
                }
            }
        );
    }

    private chooseConstants(constants) {
        this.constantsService.update({ _id: constants._id, isActive: true })
        .subscribe(
            constants => {
                this.showMessage('La instancia de valores se activó para la propuestas');
                this.refresh();
            }
        )
    }

    private refresh() {
        this.showLoader = true;
        this.constantsService.get()
        .subscribe(
            constants => {
                this.constants = new MatTableDataSource<Constants>(constants);
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
