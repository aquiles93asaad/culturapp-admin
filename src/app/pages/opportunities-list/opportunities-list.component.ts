import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
// import { SelectionModel } from '@angular/cdk/collections';
import { Opportunity, Breadcrumb, TableColumn, TableAction, OpportunityProposal, Solution, Filter } from '../../core/models';
import { OpportunityService, OpportunityProposalService, ConstantsService, UserService } from '../../core/services';
import { AuthService } from '../../auth/auth.service';
import { ConfirmDeleteModalComponent } from '../../shared/components';
import { OpportunityDemoComponent } from './opportunity-demo/opportunity-demo.component';
import { OpportunityProposalComponent } from './opportunity-proposal/opportunity-proposal.component';
import { OpportunityModalComponent } from './opportunity-modal/opportunity-modal.component';
import { OpportunityProposalBreakdownComponent } from './opportunity-proposal-breakdown/opportunity-proposal-breakdown.component';
import { OpportunityAssignmentComponent } from './opportunity-assignment/opportunity-assignment.component';

@Component({
    selector: 'app-opportunities-list',
    templateUrl: './opportunities-list.component.html',
    styleUrls: ['./opportunities-list.component.scss']
})
export class OpportunitiesListComponent implements OnInit {
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    opportunities: MatTableDataSource<Opportunity>;
    showLoader: boolean = false;
    private solutions: Solution[];
    private userSubscription: Subscription;
    private subUsers = null;
    // tableSelection = new SelectionModel<Opportunity>(true, []);

    columns: TableColumn[] = [
        { name: 'name', label: 'Nombre', type: 'string', roles: ['ALL'] },
        { name: 'createdAt', label: 'Creación', type: 'date', roles: ['ALL'] },
        { name: 'companyClient', subName: 'name', label: 'Cliente', type: 'string', roles: ['ALL'] },
        { name: 'createdBy', subName: 'name', alternateName: 'lastName', label: 'Creado por', type: 'string', roles: ['ALL'] },
        { name: 'userCompany', subName: 'createdBy', subSubName: 'name', label: 'Canal de venta', type: 'string', roles: ['ALL'] },
        { name: 'assignedTo', subName: 'name', alternateName: 'lastName', label: 'Asignado a', type: 'string', roles: ['ALL'] },
        { name: 'estimatedTotal', label: 'Total estimado', type: 'number', roles: ['ALL'] },
        { name: 'state', label: 'Estado', type: 'enum', enumValues: { active: 'Activa', won: 'Ganada', lost: 'Perdida', dismissed: 'Descartada' }, roles: ['ALL'] },
        { name: 'actions', label: 'Acciones', type: 'action', roles: ['ALL'] }
    ];

    actions: TableAction[] = [
        { name: 'demo', label: 'Solicitar demo', icon: 'play_arrow', color: 'primary', conditions: [{ key: 'state', element: 'element', values: ['active'] }] },
        { name: 'proposal', label: 'Generar propuesta', icon: 'attach_money', color: 'primary', conditions: [{ key: 'state', element: 'element', values: ['active'] }] },
        { name: 'edit', label: 'Editar oportunidad', icon: 'edit', color: 'primary', conditions: [{ key: 'state', element: 'element', values: ['active'] }] },
        { name: 'won', label: 'Ganar oportunidad', icon: 'done', color: 'primary', conditions: [{ key: 'state', element: 'element', values: ['active'] }, { key: 'estimatedTotal', element: 'element', hasValue: true }] },
        { name: 'dismissed', label: 'Descartar oportunidad', icon: 'clear', color: 'primary', conditions: [{ key: 'state', element: 'element', values: ['active'] }] },
        { name: 'lost', label: 'Perder oportunidad', icon: 'trending_down', color: 'primary', conditions: [{ key: 'state', element: 'element', values: ['active'] }] },
        { name: 'active', label: 'Reactivar oportunidad', icon: 'autorenew', color: 'primary', conditions: [{ key: 'state', element: 'element', values: ['lost', 'dismissed'] }] },
    ];

    detailListColumns: TableColumn[] = [
        { name: 'createdAt', label: 'Creación', type: 'date', roles: ['ALL'] },
        { name: 'newLicenses', label: 'Require licencias nuevas', type: 'boolean', roles: ['ALL'] },
        { name: 'needConsulting', label: 'Requiere consultoría', type: 'boolean', roles: ['ALL'] },
        { name: 'chosenSolution', label: 'Solución generica', subName: 'name', type: 'string', roles: ['ALL'] },
        { name: 'isChosenProposal', label: 'Propuesta elegida', type: 'boolean', roles: ['ALL'] },
        { name: 'estimatedTotal', label: 'Total estimado', type: 'number', roles: ['ALL'] },
        { name: 'actions', label: 'Acciones', type: 'action', roles: ['ALL'] }
    ];

    detailListActions: TableAction[] = [
        { name: 'see-proposal', label: 'Ver propuesta', icon: 'visibility', color: 'primary', conditions: [{ key: 'state', element: 'element', values: ['active'] }] },
        { name: 'choose-proposal', label: 'Elegir propuesta', icon: 'done', color: 'primary', conditions: [{ key: 'state', element: 'element', values: ['active'] }] },
        { name: 'proposal-breakdown', label: 'Ver desglose', icon: 'list', color: 'primary' }
    ];

    breadcrumbs: Breadcrumb[] = [
        { text: 'Inicio', href: '/dashboard/inicio' },
        { text: 'Seguimiento de Oportunidades', href: '/dashboard/oportunidades' }
    ];

    filters: Filter[] = [
        { name: 'name', type: 'string', condition: 'contains', placeholder: 'Filtrar por nombre', advanceSearch: false , hint: 'Filtra por palabras enteras.' },
        { name: 'createdAt_from', type: 'date', condition: 'gte', placeholder: 'Creado después del', advanceSearch: false },
        { name: 'createdAt_to', type: 'date', condition: 'lte', placeholder: 'Creado antes del', advanceSearch: false },
        { name: 'state', type: 'select', condition: 'in', placeholder: 'Estado', advanceSearch: true,
            options: [{ value: 'won', label: 'Ganada' }, { value: 'active', label: 'Activa' }, { value: 'lost', label: 'Perdida' }, { value: 'dismissed', label: 'Descartada' }] }
    ];

    constructor(
        private _route: ActivatedRoute,
        public dialog: MatDialog,
        private snackBar: MatSnackBar,
        private changeDetectorRefs: ChangeDetectorRef,
        private opportunityService: OpportunityService,
        private cosntantsService: ConstantsService,
        private proposalService: OpportunityProposalService,
        private authService: AuthService,
        private userService: UserService
    ) { }

    ngOnInit() {
        this._route.data.subscribe(
            data => {
                this.opportunities = new MatTableDataSource<Opportunity>(data.opportunitiesList.opportunities);
                this.solutions = data.opportunitiesList.solutions;
                this.solutions.push({
                    _id: 'other',
                    name: 'Otra'
                })
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

        if (user.roles.includes('SUPERVISOR') || user.roles.includes('LIDER')) {
            this.actions.push({
                name: 'assignTo', label: 'Asignar oportunidad', icon: 'person', color: 'primary', conditions: [{ key: 'state', element: 'element', values: ['active'] }]
            });

            let filters = null;

            if (user.roles.includes('SUPERVISOR')) {
                filters = {
                    supervisor: user._id
                }
            } else if (user.roles.includes('LIDER')) {
                filters = {
                    userCompany: user.userCompany._id
                }
            }

            this.userService.get(filters)
            .subscribe(
                users => {
                    this.subUsers = users;
                }
            )
        }

        if(user.profiles.includes('ADMIN')) {
            this.actions.push({
                name: 'delete', label: 'Eliminar oportunindad', icon: 'delete', color: 'primary', conditions: [{ key: 'state', element: 'element', values: ['active', 'lost', 'dismissed'] }]
            });

            this.detailListActions.push({
                name: 'delete-proposal', label: 'Eliminar propuesta', icon: 'delete', color: 'primary', conditions: [{ key: 'state', element: 'element', values: ['active', 'lost', 'dismissed'] }]
            });
        }
    }

    opportunitiesActions(actionData) {
        let opportunity = null;
        let proposal = null;
        const action = actionData.action;

        // Sets the opportunity and the proposal to understand better the code. opportunity always has "state" attribute, while proposal does not have this attribute
        if (typeof actionData.element !== 'undefined' && typeof actionData.element.state !== 'undefined') {
            opportunity = actionData.element;
        } else {
            proposal = actionData.element;
            opportunity = actionData.parentElement;
        }

        if (action == 'demo') {
            this.openDemoDialog(opportunity);
        }

        if (action == 'proposal' || action == 'see-proposal') {
            this.cosntantsService.check()
            .subscribe(
                isThereActiveConstants => {
                    if (isThereActiveConstants) {
                        if (action == 'proposal') {
                            this.openProposalDialog(opportunity);
                        } else if (action == 'see-proposal') {
                            this.openProposalDialog(opportunity, proposal);
                        }
                    } else {
                        this.showMessage('No están los datos necesarios para la creación de propuestas. Contacte el administrador.')
                    }
                },
                error => {
                    this.showMessage(error.statusText);
                },
            )
        }

        if (action == 'edit') {
            this.openOpportunityDialog(opportunity);
        }

        if (action == 'won' || action == 'dismissed' || action == 'lost' || action == 'active') {
            this.updateOpportunityState(opportunity, action);
        }

        if (action == 'assignTo') {
            this.openOpportunityAssignmentDialog(opportunity);
        }

        if (action == 'delete') {
            this.openDeleteDialog('Eliminar esta oportunidad eliminaría todas las propuestas asosciadas', 'La oportunidad se eliminó correctamente', actionData.element, actionData.parentElement);
        }

        if (action == 'choose-proposal') {
            this.chooseProposal(opportunity, proposal);
        }

        if (action == 'proposal-breakdown') {
            this.openProposalBreakdownDialog(proposal);
        }
        
        
        if(action == 'delete-proposal') {
            let message = '';
            if(actionData.element.isChosenProposal) {
                message = 'Esta propuesta es la elegida, eliminarla deja la oportunidad sin valor estimado';
            } else {
                message = 'Eliminar esta propuesta';
            }
            this.openDeleteDialog(message, 'La propuesta fue se eliminó correctamente', actionData.element, actionData.parentElement);
        }

        if (action == 'filter') {
            this.refresh(actionData.value);
        }
    }

    private openDemoDialog(opportunity) {
        const dialogRef = this.dialog.open(OpportunityDemoComponent, {
            height: '90%',
            width: '60%',
            data: opportunity
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if (typeof result !== 'undefined') {
                    this.showMessage('Una demo para "' + opportunity.name + '" fue solicitada correctamente');
                    this.refresh();
                }
            }
        );
    }

    private openProposalDialog(opportunity: Opportunity, proposal?: OpportunityProposal) {
        if (typeof proposal === 'undefined' && opportunity.opportunityProposals.length == 3) {
            this.showMessage('Esta oportunidad ya tiene 3 propuestas registradas');
        } else {
            const data = {
                proposal: proposal,
                opportunity: opportunity,
                solutions: this.solutions
            };

            const dialogRef = this.dialog.open(OpportunityProposalComponent, {
                height: '90%',
                width: '60%',
                data: data
            });
            dialogRef.afterClosed().subscribe(
                result => {
                    if (typeof result !== 'undefined') {
                        if (proposal) {
                            this.showMessage('La propuesta fue modififcada correctamente');
                        } else {
                            this.showMessage('Una propuesta para "' + opportunity.name + '" fue solicitada correctamente');
                        }

                        this.refresh();

                    }
                }
            );
        }
    }

    private openProposalBreakdownDialog(proposal: OpportunityProposal) {
        const dialogRef = this.dialog.open(OpportunityProposalBreakdownComponent, {
            height: '90%',
            width: '60%',
            data: proposal
        });
        dialogRef.afterClosed().subscribe(
            result => {
            }
        );
    }

    private openOpportunityDialog(opportunity) {
        const dialogRef = this.dialog.open(OpportunityModalComponent, {
            height: '90%',
            width: '60%',
            data: opportunity
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if (typeof result !== 'undefined') {
                    this.showMessage('La oportunidad "' + result.name + '" fue modificada correctamente');
                    this.refresh();
                }
            }
        );
    }

    private openOpportunityAssignmentDialog(opportunity) {
        const dialogRef = this.dialog.open(OpportunityAssignmentComponent, {
            height: '40%',
            width: '40%',
            data: {
                opportunity: opportunity,
                users: this.subUsers
            }
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if (typeof result !== 'undefined') {
                    this.showMessage('La oportunidad "' + result.name + '" fue asignada correctamente');
                    this.refresh();
                }
            }
        );
    }

    private updateOpportunityState(opportunity, state) {
        this.opportunityService.update({ _id: opportunity._id, state: state })
            .subscribe(
                opportunity => {
                    this.showMessage('Estado de la oportunidad ' + opportunity.name + ' fue actualizado');
                    this.refresh();
                }
            )
    }

    private chooseProposal(opportunity, proposal) {
        this.proposalService.update({ _id: proposal._id, isChosenProposal: true, estimatedTotal: proposal.estimatedTotal }, opportunity._id)
            .subscribe(
                proposal => {
                    this.showMessage('Total estimado de la oportunidad ' + opportunity.name + ' fue actualizado');
                    this.refresh();
                }
            )
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
                        this.proposalService.remove(element, parentElement._id)
                        .subscribe(
                            result => {
                                this.showMessage(snackMessage);
                                this.refresh({});
                            }
                        )
                    } else {
                        this.opportunityService.remove(element)
                        .subscribe(
                            result => {
                                this.showMessage(snackMessage);
                                this.refresh({});
                            }
                        )
                    }
                }
            }
        );
    }

    private refresh(filters?) {
        this.showLoader = true;
        this.opportunityService.get(filters)
        .subscribe(
            opportunities => {
                this.opportunities = new MatTableDataSource<Opportunity>(opportunities);
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