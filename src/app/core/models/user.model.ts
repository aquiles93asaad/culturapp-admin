import { Curso } from "./curso.model";
import { Centro } from "./centro.model";

export interface User {
    _id?: string;
    password?: string;
    nombre: string;
    apellido: string,
    email: string;
    dni: string,
    fechaNacimiento: Date,
    telefono: string,
    sexo: string,
    direccion: string,
    esProfesor: boolean,
    esAdmin: boolean,
    esSuperAdmin: boolean,
    centro: Centro,
    cursosInscriptos: Curso[]
}
