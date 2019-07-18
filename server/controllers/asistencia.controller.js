const Asistencia = require('../models/asistencia.model');
const Curso = require('../models/curso.model');
const User = require('../models/usuario.model');

async function create() {
    try {

    } catch(error) {
        console.log(error);
        return error;
    }
}

async function get(reqUser, filters) {
    try {
        console.log(reqUser.centro._id);
        const cursos = await Curso.find(
            { centro: reqUser.centro._id }
        )
        let cursosIds = [];
        for (let i = 0; i < cursos.length; i++) {
            cursosIds.push(cursos[i]._id)
        }
        const asistencias = await Asistencia.find(
            { curso: { $in: cursosIds }}
        ).populate({ path: 'curso', model: Curso })
        .populate({ path: 'ausentes', model: User, select: 'nombre apellido' })
        .populate({ path: 'presentes', model: User, select: 'nombre apellido' });

        return asistencias;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function update(asistenciaData) {
    try {

    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = {
    create,
    get,
    update,
};
