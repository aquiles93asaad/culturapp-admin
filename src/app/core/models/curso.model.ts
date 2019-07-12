import { User } from './user.model';
import { Materia } from './materia.model';
import { Asistencia } from './asistencia.model';
import { Notificacion } from './notificacion.model';

export interface Curso {
    fechaInicio: Date,
    fechaFin: Date,
    duracion: string,
    precio: number,
    horario: string[],
    dia: string[],
    materia: Materia,
    users: User[],
    profesores: User[],
    alumnos: User[],
    asistencias: Asistencia[],
    notificaciones: Notificacion[]
}