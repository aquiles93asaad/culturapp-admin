import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CursoService, MateriaService, UserService } from '../../../core/services';
import { Curso, Materia, User } from '../../../core/models';
import * as moment from 'moment';
import { forkJoin, Observable } from 'rxjs';

@Component({
    selector: 'app-cursos-modal',
    templateUrl: './cursos-modal.component.html',
    styleUrls: ['./cursos-modal.component.scss']
})
export class CursosModalComponent implements OnInit {
    isSubmitting: boolean = false;
    cursoForm: FormGroup;
    diasYHorariosList: FormArray;
    materias: Materia[];
    profesores: User[];

    weekDays = [
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
        'Domingo'
    ];

    constructor(
        public dialogRef: MatDialogRef<CursosModalComponent>,
        private fb: FormBuilder,
        public cursoService: CursoService,
        private materiaService: MateriaService,
        private userService: UserService,
        private snackBar: MatSnackBar,
        @Optional() @Inject(MAT_DIALOG_DATA) public curso: Curso
    ) { }

    ngOnInit() {

        this.getMateriasYProfesores()
        .subscribe(
            ([materias, profesores]) => {
                this.materias = materias;
                this.profesores = profesores;
            }
        );

        this.cursoForm = this.fb.group({
            nombre: [(this.curso) ? this.curso.nombre : ''],
            nivel: [(this.curso) ? this.curso.nivel : ''],
            descripcion: [(this.curso) ? this.curso.descripcion : ''],
            materia: [(this.curso && this.curso.materia) ? this.curso.materia._id : ''],
            profesores: [(this.curso && this.curso.profesores) ? this.curso.profesores : ''],
            fechaInicio: [(this.curso) ? this.curso.fechaInicio : ''],
            fechaFin: [(this.curso) ? this.curso.fechaFin : ''],
            duracion: [(this.curso) ? this.curso.duracion : ''],
            precio: [(this.curso) ? this.curso.precio : ''],
            diasYHorarios: this.fb.array(this.initialDiasYHorarios())
        });

        this.diasYHorariosList = this.cursoForm.get('diasYHorarios') as FormArray;
    }

    get f() { return this.cursoForm.controls; }

    // returns all form groups under diasYHorarios
    get diasYHorariosFormGroup() {
        return this.cursoForm.get('diasYHorarios') as FormArray;
    }

    addQuestion() {
        this.diasYHorariosList.push(
            this.fb.group({
                dia: [''],
                horario: ['']
            })
        );
    }

    removeQuestion(i) {
        this.diasYHorariosList.removeAt(i);
    }

    submitForm() {
        if (this.cursoForm.valid) {
            if (!this.curso) {
                let curso = this.cursoForm.value;
                this.isSubmitting = true;
                this.cursoService.create(curso)
                .subscribe(
                    newCurso => {
                        // this.dialogRef.close(newCurso);
                    },
                    error => {
                        console.log(error);
                    },
                    () => {
                        this.isSubmitting = false;
                    }
                )
            } else {
                if (this.dataChanged()) {
                    this.isSubmitting = true;
                    this.cursoService.update(this.curso)
                        .subscribe(
                            constants => {
                                this.dialogRef.close(constants);
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

    private dataChanged(): boolean {
        let result = false;
        const controls = this.cursoForm.controls
        for (const control in controls) {
            if (controls.hasOwnProperty(control)) {
                if (this.curso[control] != controls[control].value) {
                    this.curso[control] = controls[control].value;
                    result = true;
                }
            }
        }
        return result;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    private showMessage(message) {
        this.snackBar.open(message, '', {
            duration: 2000,
            panelClass: ['justify-content-center', 'd-flex', 'mb-3']
        });
    }

    public getMateriasYProfesores(): Observable<any[]> {
        const profFilters = {
            esProfesor: true,
            centro: (<any>window).user.centro
        };
        let materias = this.materiaService.get();
        let profesores = this.userService.get(profFilters);

        return forkJoin([materias, profesores]);
    }

    private initialDiasYHorarios(): FormGroup[] {
        let result: FormGroup[] = [];

        if(this.curso && this.curso.diasYHorarios && this.curso.diasYHorarios.length > 0) {
            for (let i = 0; i < this.curso.diasYHorarios.length; i++) {
                result.push(
                    this.fb.group({
                        label: [this.curso.diasYHorarios[i].dia],
                        dataType: [this.curso.diasYHorarios[i].horario]
                    })
                );
            }
        } else {
            result.push(
                this.fb.group({
                    dia: [''],
                    horario: ['']
                })
            );
        }

        return result;
    }
}
