import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Solution } from '../../../core/models';
import { SolutionService } from '../../../core/services';

@Component({
    selector: 'app-solution-modal',
    templateUrl: './solution-modal.component.html',
    styleUrls: ['./solution-modal.component.scss']
})
export class SolutionModalComponent implements OnInit {
    solutionForm: FormGroup;
    questionsList: FormArray;
    isSubmitting: boolean = false;

    questionTypes = [
        'Boolean',
        'String',
        'Number'
    ];

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<SolutionModalComponent>,
        private snackBar: MatSnackBar,
        private solutionService: SolutionService,
        @Optional() @Inject(MAT_DIALOG_DATA) public solution: Solution
    ) { }

    ngOnInit() {
        this.solutionForm = this.fb.group({
            name: [(this.solution) ? this.solution.name : '', Validators.required],
            description: [(this.solution) ? this.solution.description : '', Validators.required],
            hoursSmall: [(this.solution) ? this.solution.hoursSmall : '', Validators.required],
            hoursMedium: [(this.solution) ? this.solution.hoursMedium : '', Validators.required],
            hoursBig: [(this.solution) ? this.solution.hoursBig : '', Validators.required],
            documentClassesCount: [(this.solution) ? this.solution.documentClassesCount : '', Validators.required],
            questions: this.fb.array(this.initialQuestions())
        });

        this.questionsList = this.solutionForm.get('questions') as FormArray;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    // convenience getter for easy access to form fields
    get f() { return this.solutionForm.controls; }
    // returns all form groups under questions
    get questionsFormGroup() {
        return this.solutionForm.get('questions') as FormArray;
    }

    submitForm() {
        if(this.solutionForm.valid) {
            if(!this.solution) {
                let newSolution: Solution = this.solutionForm.value;
                console.log(newSolution.questions);
                if(newSolution.questions && newSolution.questions.length > 0 && (newSolution.questions[0].label == '' || newSolution.questions[0].dataType == '')) {
                    delete newSolution.questions;
                }
                this.isSubmitting = true;
                this.solutionService.create(newSolution)
                .subscribe(
                    solution => {
                        this.dialogRef.close(solution);
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
                    this.solutionService.update(this.solution)
                    .subscribe(
                        solution => {
                            this.dialogRef.close(solution);
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

    addQuestion() {
        this.questionsList.push(
            this.fb.group({
                label: [''],
                dataType: ['']
            })
        );
    }

    removeQuestion(i) {
        this.questionsList.removeAt(i);
    }

    getContactsFormGroup(index): FormGroup {
        const formGroup = this.questionsList.controls[index] as FormGroup;
        return formGroup;
    }

    private dataChanged(): boolean {
        let result = false;
        const controls = this.solutionForm.controls
        for (const control in controls) {
            if (controls.hasOwnProperty(control)) {
                if(this.solution[control] != controls[control].value) {
                    this.solution[control] = controls[control].value;
                    result = true;
                }
            }
        }
        return result;
    }

    private initialQuestions(): FormGroup[] {
        let result: FormGroup[] = [];

        if(this.solution && this.solution.questions && this.solution.questions.length > 0) {
            for (let i = 0; i < this.solution.questions.length; i++) {
                result.push(
                    this.fb.group({
                        label: [this.solution.questions[i].label],
                        dataType: [this.solution.questions[i].dataType]
                    })
                );
            }
        } else {
            result.push(
                this.fb.group({
                    label: [''],
                    dataType: ['']
                })
            );
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
