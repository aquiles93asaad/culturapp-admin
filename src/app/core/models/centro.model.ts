import { User } from './user.model';
import { Curso } from './curso.model';

export interface Centro {
    _id?: string,
    nombre: string,
    descripcion: string,
    telefono: string,
    sedes: [{
        localidad: string,
        direccion: string,
        nombre: string
    }],
    profesores: User[],
    cursos: Curso[]
}