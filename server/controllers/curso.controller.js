const Curso = require('../models/curso.model');
const Centro = require('../models/centro.model');
const User = require('../models/usuario.model');

async function create(curso) {
    try {
        const createdCurso = await Curso(curso).save();
        return createdCurso;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function get(reqUser, filters) {
    try {
        if(reqUser.esAdmin) {
            filters['centro'] = reqUser.centro._id;
        }

        const cursos = await Curso.find(
            filters
        ).populate({ path: 'centro', model: Centro })
        .populate({ path: 'profesores', model: User });
        return cursos;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function update(cursoData) {
    try {
        const updatedCurso = await Curso.findOneAndUpdate(
            { _id: cursoData._id },
            cursoData,
            { new: true }
        );
        return updatedCurso;
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
