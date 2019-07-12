import { User } from './user.model';

export interface Asistencia {
    fechaClase: Date,
    presentes: User[],
    ausentes: User[],
}