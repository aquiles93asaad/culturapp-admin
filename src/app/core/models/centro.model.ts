import { User } from './user.model';
import { Curso } from './curso.model';

export interface Centro {
    _id?: string,
    nombre: string,
    descripcion: string,
    direccion: string,
    profesores: User[],
    cursos: Curso[]
}