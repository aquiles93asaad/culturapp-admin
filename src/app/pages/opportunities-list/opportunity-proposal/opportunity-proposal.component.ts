import { Component, OnInit, Inject, Optional, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { OpportunityProposal, Solution, Constants } from '../../../core/models';
import { OpportunityProposalService } from '../../../core/services';

@Component({
    selector: 'app-opportunity-proposal',
    templateUrl: './opportunity-proposal.component.html',
    styleUrls: ['./opportunity-proposal.component.scss']
})
export class OpportunityProposalComponent implements OnInit {
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    proposalForm: FormGroup;
    isSubmitting: boolean = false;
    solutions: Solution[];
    proposal: OpportunityProposal;
    chosenSolution: Solution = null;
    private constants: Constants;

    constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<OpportunityProposalComponent>,
        private snackBar: MatSnackBar,
        private changeDetectorRefs: ChangeDetectorRef,
        private proposalService: OpportunityProposalService,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {
        this.solutions = this.data.solutions;

        this.proposal = this.data.proposal;
        this.proposalForm = this.formBuilder.group({
            hasThLicenses: [(this.proposal && this.proposal.thLicenses != null) ? true : false],
            hasCkLicenses: [(this.proposal && this.proposal.ckLicenses != null) ? true : false],
            thLicenses: [(this.proposal) ? this.proposal.thLicenses : ''],
            ckLicenses: [(this.proposal) ? this.proposal.ckLicenses : ''],
            newLicenses: [(this.proposal) ? this.proposal.newLicenses : false],
            needConsulting: [(this.proposal) ? this.proposal.needConsulting : false],
            newThLicenses: [(this.proposal) ? this.proposal.newThLicenses : ''],
            newCkLicenses: [(this.proposal) ? this.proposal.newCkLicenses : ''],
            chosenSolution: [(this.proposal && this.proposal.chosenSolution) ? this.proposal.chosenSolution._id : ''],
            contractDuration: [(this.proposal) ? this.proposal.contractDuration : ''],
            notes: [(this.proposal) ? this.proposal.notes : ''],
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.proposalForm.controls; }

    closeDialog() {
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    solutionField() {
        const hasLicenses = (this.proposalForm.get('hasThLicenses').value || this.proposalForm.get('hasCkLicenses').value) ? true : false;
        const newLicenses = this.proposalForm.get('newLicenses').value;
        const needConsulting = this.proposalForm.get('needConsulting').value;

        if ((hasLicenses && (!newLicenses || (newLicenses && needConsulting))) || (!hasLicenses && newLicenses && needConsulting)) {
            return true;
        }

        this.proposalForm.get('chosenSolution').setValue(null);
        this.chosenSolution = null;
        return false;
    }

    addSolutionQuestions() {
        this.setChosenSolution();
        const solution = this.chosenSolution;
        if (solution && solution.name != 'Otra') {
            if (solution.questions.length > 0) {
                const hastValues = (this.proposal && this.proposal.solutionQuestions && this.proposal.solutionQuestions.length > 0) ? true : false;
                for (let i = 0; i < solution.questions.length; i++) {
                    let value = '';
                    (hastValues) ? value = this.proposal.solutionQuestions[i].value : '';
                    this.proposalForm.addControl('solutionsQuestions_' + i, new FormControl(value))
                }
            } else {
                this.removeGenericSolutionQuestions();
            }
            this.removeSpecificSolQuestions();
        } else if (solution && solution.name == 'Otra') {
            this.removeGenericSolutionQuestions();
            this.addSpecificSolQuestions();
        } else {
            // Este caso es para la edición, en el caso que la solución es null, entonces pregutno si la proposal cargada tiene un valor de implementation_adminsTraining
            // Si lo tiene entocnes es una solución con el tipo de solución "Otra" porque esta pregunta es obligatoria
            if (this.proposal && this.proposal.estimatedTotal != null) {
                this.proposalForm.get('chosenSolution').setValue('other');
                this.addSpecificSolQuestions();
            }
        }
        this.changeDetectorRefs.detectChanges();
    }

    addSpecificSolQuestions() {
        if (this.data.opportunity.digitization) {
            this.proposalForm.addControl('digitization_docTypes', new FormControl((this.proposal) ? this.proposal.digitization_docTypes : ''));
            this.proposalForm.addControl('digitization_avFieldsDocType', new FormControl((this.proposal) ? this.proposal.digitization_avFieldsDocType : ''));
            this.proposalForm.addControl('digitization_autoRecognition', new FormControl((this.proposal) ? this.proposal.digitization_autoRecognition : false));
            this.proposalForm.addControl('digitization_autoRecognitionDocs', new FormControl((this.proposal) ? this.proposal.digitization_autoRecognitionDocs : ''));
            this.proposalForm.addControl('digitization_docsPdfTextLayer', new FormControl((this.proposal) ? this.proposal.digitization_docsPdfTextLayer : false));
            this.proposalForm.addControl('digitization_docsBarcode', new FormControl((this.proposal) ? this.proposal.digitization_docsBarcode : false));
            this.proposalForm.addControl('digitization_extractDocsData', new FormControl((this.proposal) ? this.proposal.digitization_extractDocsData : false));
            this.proposalForm.addControl('digitization_avExtractFields', new FormControl((this.proposal) ? this.proposal.digitization_avExtractFields : ''));
        }

        if (this.data.opportunity.docManager) {
            this.proposalForm.addControl('docManager_docsClasses', new FormControl((this.proposal) ? this.proposal.docManager_docsClasses : ''));
            this.proposalForm.addControl('docManager_avFieldsDocClass', new FormControl((this.proposal) ? this.proposal.docManager_avFieldsDocClass : ''));
            this.proposalForm.addControl('docManager_storageLogic', new FormControl((this.proposal) ? this.proposal.docManager_storageLogic : false));
            this.proposalForm.addControl('implementation_type', new FormControl((this.proposal) ? this.proposal.implementation_type : ''));
        }

        if (this.data.opportunity.automation) {
            this.proposalForm.addControl('automation_workflows', new FormControl((this.proposal) ? this.proposal.automation_workflows : ''));
            this.proposalForm.addControl('automation_avStatesWorkflow', new FormControl((this.proposal) ? this.proposal.automation_avStatesWorkflow : ''));
            this.proposalForm.addControl('automation_monitors', new FormControl((this.proposal) ? this.proposal.automation_monitors : ''));
            this.proposalForm.addControl('automation_groups', new FormControl((this.proposal) ? this.proposal.automation_groups : ''));
            this.proposalForm.addControl('automation_prototypes', new FormControl((this.proposal) ? this.proposal.automation_prototypes : ''))
        }

        this.proposalForm.addControl('implementation_adIntegration', new FormControl((this.proposal) ? this.proposal.implementation_adIntegration : false));
        this.proposalForm.addControl('implementation_adminsTraining', new FormControl((this.proposal) ? this.proposal.implementation_adminsTraining : false));
        this.changeDetectorRefs.detectChanges();
    }

    submitForm() {
        if (this.proposalForm.valid) {
            if(!this.data.proposal) {
                this.isSubmitting = true;
                let newProposal: OpportunityProposal = this.proposalForm.value;
                // this.calculateTotal(newProposal);
                this.modifyProposalQuestions(newProposal);
                this.proposalService.create(newProposal, this.data.opportunity._id)
                .subscribe(
                    proposal => {
                        this.dialogRef.close(proposal);
                    },
                    error => {
                        this.showMessage(error.statusText);
                    },
                    () => {
                        this.isSubmitting = false;
                    }
                )
            } else {
                if(this.dataChanged()) {
                    this.isSubmitting = true;
                    // this.calculateTotal(this.proposal);
                    this.modifyProposalQuestions(this.proposal);
                    this.proposalService.update(this.proposal, this.data.opportunity._id)
                    .subscribe(
                        proposal => {
                            this.dialogRef.close(proposal);
                        },
                        error => {
                            this.showMessage(error.statusText);
                        },
                        () => {
                            this.isSubmitting = false;
                        }
                    )
                } else {
                    this.onNoClick();
                }
            }
        }
    }

    private removeGenericSolutionQuestions() {
        for (const control in this.proposalForm.controls) {
            if (this.proposalForm.controls.hasOwnProperty(control)) {
                if (control.includes('solutionsQuestions_')) {
                    this.proposalForm.removeControl(control);
                }
            }
        }
    }

    private removeSpecificSolQuestions() {
        for (const control in this.proposalForm.controls) {
            if (this.proposalForm.controls.hasOwnProperty(control)) {
                if(control.includes('digitization') || control.includes('docManager') || control.includes('automation') || control.includes('implementation')) {
                    this.proposalForm.removeControl(control);
                }
            }
        }
    }

    private calculateTotal(proposal: OpportunityProposal) {
        let total: number = 0;

        if (proposal.newLicenses) {
            total = total + (proposal.newThLicenses * this.constants.thubanLicense) + (proposal.newCkLicenses * this.constants.capitkaLicense) + (proposal.newThLicenses * this.constants.thubanMaintenance * proposal.contractDuration) + (proposal.newCkLicenses * this.constants.captikaMaintenance * proposal.contractDuration)
        }

        if (this.chosenSolution && this.chosenSolution.name != 'Otra') {
            let hoursType = '';
            switch (this.data.opportunity.companyClient.type) {
                case 'small':
                    hoursType = 'hoursSmall';
                    break;
                case 'medium':
                    hoursType = 'hoursMedium';
                    break;
                case 'big':
                    hoursType = 'hoursBig';
                    break;
            }
            total = total + (this.chosenSolution[hoursType] * this.constants.hourValue);
        }

        if (this.chosenSolution && this.chosenSolution.name == 'Otra') {
            // Cantidad de horas que suman las respsuestas de las preguntas especificias cuando la solución es customizada. 16 horas de base para la instalación, y 80 análisis y especificación
            let consultingHours = this.constants.installation + this.constants.analisis;
            if (this.data.opportunity.digitization) {
                consultingHours = consultingHours + (proposal.digitization_docTypes * this.constants.docTypeHours) + (proposal.digitization_autoRecognitionDocs * this.constants.autoRecognitionDocHours);
            }

            if (this.data.opportunity.docManager) {
                consultingHours = consultingHours + (proposal.docManager_docsClasses * this.constants.documentClassHours) + (proposal.docManager_avFieldsDocClass * this.constants.documentClassFieldHours);
            }

            if (this.data.opportunity.automation) {
                consultingHours = consultingHours + (proposal.automation_workflows * this.constants.wokflowHours) + (proposal.automation_avStatesWorkflow * this.constants.wokflowStatesHours) + (proposal.automation_monitors * this.constants.monitorHours) + (proposal.automation_groups * this.constants.groupsHours);
            }

            // Acá se agregan los porcentajes de horas de scriptiing y prototipos si hay prototipos
            consultingHours = consultingHours + ( Math.round(((consultingHours * this.constants.scriptingPercentaje)/100) * 1e2) / 1e2 );

            if(this.data.opportunity.automation && proposal.automation_prototypes > 1) {
                // para el segundo protitipo
                consultingHours = consultingHours + ( Math.round(((consultingHours * this.constants.secondPrototypePercentaje)/100) * 1e2) / 1e2 );

                if(proposal.automation_prototypes > 2) {
                    // para el tercer protitipo
                    consultingHours = consultingHours + ( Math.round(((consultingHours * this.constants.thirdPrototypePercentaje)/100) * 1e2) / 1e2 );
                }
            }

            total = total + (consultingHours * this.constants.hourValue);

            // Acá se agrega al todal el número fijo de capacitación si hay que incluirlo
            if (proposal.implementation_adminsTraining) {
                total = total + this.constants.adminsTraining;
            }
        }

        proposal.estimatedTotal = total;
    }

    private modifyProposalQuestions(proposal: OpportunityProposal) {
        if(this.chosenSolution) {
            if(this.chosenSolution.name != 'Otra') {
                if(this.chosenSolution.questions) {
                    proposal.solutionQuestions = [];
                    for (let i = 0; i < this.chosenSolution.questions.length; i++) {
                        proposal.solutionQuestions[i] = {
                            label: this.chosenSolution.questions[i].label,
                            value: this.proposalForm.get('solutionsQuestions_' + i).value
                        }
                        delete proposal['solutionsQuestions_' + i];
                    }
                }
            }
            // } else {
            //     delete proposal.chosenSolution;
            // }
        }
    }

    private setChosenSolution() {
        for (let i = 0; i < this.solutions.length; i++) {
            if(this.solutions[i]._id == this.proposalForm.get('chosenSolution').value) {
                this.chosenSolution = this.solutions[i];
                break;
            }
        }
    }

    private dataChanged(): boolean {
        let result = false;
        const controls = this.proposalForm.controls
        for (const control in controls) {
            if (controls.hasOwnProperty(control)) {
                if(!control.includes('solutionsQuestions_') && this.proposal[control] != controls[control].value) {
                    this.proposal[control] = controls[control].value;
                    result = true;
                } else if(control.includes('solutionsQuestions_')) {
                    let index = control.split('_')[1];
                    if(this.proposal.solutionQuestions) {
                        this.proposal.solutionQuestions[index].value = controls[control].value;
                        result = true;
                    }
                }
            }
        }
        return result;
    }

    private showMessage(message) {
        this.snackBar.open(message, '', {
            duration: 2000,
            panelClass: ['justify-content-center', 'd-flex', 'mb-3']
        });
    }
}
