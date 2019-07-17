import { User } from './user.model';
import { Materia } from './materia.model';
import { Asistencia } from './asistencia.model';
import { Notificacion } from './notificacion.model';
import { Centro } from './centro.model';

export interface Curso {
    _id?: string,
    nombre: string,
    descripcion: string,
    fechaInicio: Date,
    fechaFin: Date,
    precio: number,
    diasYHorarios: [{
        dia: string,
        horarioDesde: string
        horarioHasta: string
    }],
    sede: {
        localidad: string,
        direccion: string,
        nombre: string,
        _id?: string
    },
    vacantes: number,
    nivel: string,
    materia: Materia,
    centro: Centro,
    users: User[],
    profesores: User[],
    alumnos: User[],
    asistencias: Asistencia[],
    notificaciones: Notificacion[]
}