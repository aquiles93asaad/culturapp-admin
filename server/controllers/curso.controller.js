const Curso = require('../models/curso.model');
const Centro = require('../models/centro.model');
const User = require('../models/usuario.model');
const Asistencia = require('../models/asistencia.model');
const Materia = require('../models/materia.model');
var moment = require('moment');
const _ = require('lodash');

async function create(curso) {
    try {
        let createdCurso = await Curso(curso).save();
        let profesoresIds = [];
        let asistencias = [];
        for (let i = 0; i < createdCurso.profesores.length; i++) {
            profesoresIds.push(createdCurso.profesores[i]);
        }

        await User.updateMany(
            { _id: { $in: profesoresIds }},
            { $push: { cursosInscriptos: createdCurso._id } }
        )

        for (let i = 0; i < curso.diasYHorarios.length; i++) {
            let dates = getDaysBetweenDates(moment(curso.fechaInicio), moment(curso.fechaFin), curso.diasYHorarios[i].dia, createdCurso._id);
            if(asistencias.length == 0) {
                asistencias = dates;
            } else {
                asistencias = asistencias.concat(dates);
            }
        }
        const asistenciasIds = await Asistencia.insertMany(asistencias);
        for (let i = 0; i < asistenciasIds.length; i++) {
            createdCurso.asistencias.push(asistenciasIds[i]._id);
        }
        const returnCurso = update(createdCurso);
        return returnCurso;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function get(reqUser, filters, myCursos) {
    try {
        if (reqUser.esAdmin) {
            filters['centro'] = reqUser.centro._id;
        }

        if(!myCursos) {
            filters['alumnos'] = { $nin: [reqUser._id] };
        } else {
            filters['alumnos'] = { $elemMatch: { $in: [reqUser._id] } }
        }

        let rawCursos = await Curso.find(
            filters
        ).populate({ path: 'centro', model: Centro })
        .populate({ path: 'profesores', model: User, select: 'nombre apellido' })
        .populate({ path: 'materia', model: Materia, select: 'nombre' })
        .populate({ path: 'asistencias', model: Asistencia, populate: [{ path: 'presentes', Model: User, select: 'nombre apellido'}, {path: 'ausentes', Model: User, select: 'nombre apellido'}]});
        const cursos = processCursos(rawCursos);
        return cursos;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function update(cursoData) {
    try {
        const updatedCurso = await Curso.findOneAndUpdate(
            { _id: cursoData._id },
            cursoData,
            { returnNewDocument: true }
        );
        return updatedCurso;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function addUserToCurso(reqUser, cursoId) {
    try {
        const curso = await Curso.findOne(
            { _id: cursoId },
        );
        reqUser.cursosInscriptos.push(cursoId);
        await User.findOneAndUpdate(
            { _id: reqUser._id },
            reqUser
        )
        curso.vacantes = curso.vacantes -1;
        curso.alumnos.push(reqUser._id);
        const updatedCurso = Curso.findOneAndUpdate(
            { _id: cursoId },
            curso,
            { returnNewDocument: true }
        )
        return updatedCurso;
    } catch (error) {
        console.log(error);
        return error;
    }
}

/* Given a start date, end date and day name, return
** an array of dates between the two dates for the
** given day inclusive
** @param {Date} start - date to start from
** @param {Date} end - date to end on
** @param {string} dayName - name of day
** @returns {Array} array of Dates
*/
function getDaysBetweenDates(start, end, dayName, cursoId) {
    var result = [];
    var days = { Domingo: 0, Lunes: 1, Martes: 2, Miércoles: 3, Jueves: 4, Viernes: 5, Sábado: 6 };
    var day = days[dayName];
    var current = start.clone();
    current.day(current.day() + (day - current.day() + 7) % 7);
    while(current.isSameOrBefore(end)) {
        result.push({ fechaClase: current.clone(), curso: cursoId });
        current.day(current.day() + 7);
    }

    return result;
}

function processCursos(cursos) {
    let finalResult = _.map(cursos, _.partial(_.pick, _, ['_id', 'alumnos', 'asistencias', 'nombre', 'nivel', 'descripcion', 'materia', 'fechaInicio', 'fechaFin', 'duracion', 'precio', 'diasYHorarios', 'centro', 'profesores', 'vacantes', 'sede']));
    for (let i = 0; i < cursos.length; i++) {
        let result = '';
        let profesores = cursos[i].profesores;
        for (let j = 0; j < profesores.length; j++) {
            (result != '') ? result = result + ', ': result = result;
            result = result +  profesores[j].nombre + ' ' + profesores[j].apellido;
        }
        finalResult[i]['profesor'] = result;
    }
    return finalResult;
}

module.exports = {
    create,
    get,
    update,
    addUserToCurso,
};
