import { User } from './user.model';
import { Materia } from './materia.model';
import { Asistencia } from './asistencia.model';
import { Notificacion } from './notificacion.model';

export interface Curso {
    _id?: string,
    nombre: string,
    descripcion: string,
    fechaInicio: Date,
    fechaFin: Date,
    duracion: number,
    precio: number,
    dia: string,
    horario: Date,
    nivel: string,
    materia: Materia,
    users: User[],
    profesores: User[],
    alumnos: User[],
    asistencias: Asistencia[],
    notificaciones: Notificacion[]
}