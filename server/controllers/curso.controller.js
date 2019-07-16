const Curso = require('../models/curso.model');
const Centro = require('../models/centro.model');
const User = require('../models/usuario.model');
const Asistencia = require('../models/asistencia.model');
var moment = require('moment');

async function create(curso) {
    try {
        let asistencias = [];
        for (let i = 0; i < curso.diasYHorarios.length; i++) {
            let dates = getDaysBetweenDates(moment(curso.fechaInicio), moment(curso.fechaFin), curso.diasYHorarios[i].dia);
            if(asistencias.length == 0) {
                asistencias = dates;
            } else {
                asistencias.concat(dates);
            }
        }

        const asistenciasIds = await Asistencia.insertMany(asistencias);
        curso.asistencias = asistenciasIds.insertedIds;
        const createdCurso = await Curso(curso).save();
        return createdCurso;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function get(reqUser, filters) {
    try {
        if (reqUser.esAdmin) {
            filters['centro'] = reqUser.centro._id;
        }

        const cursos = await Curso.find(
            filters
        ).populate({ path: 'centro', model: Centro })
        .populate({ path: 'profesores', model: User });
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
            { new: true }
        );
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
function getDaysBetweenDates(start, end, dayName) {
    var result = [];
    var days = { Domingo: 0, Lunes: 1, Martes: 2, Miércoles: 3, Jueves: 4, Viernes: 5, Sábado: 6 };
    var day = days[dayName];
    var current = start.clone();

    if(current.day() == day) {
        result.push({ fechaClase: current.clone() });
    }

    while (current.day(7 + day).isBefore(end)) {
        result.push({ fechaClase: current.clone() });
    }

    return result;
}

module.exports = {
    create,
    get,
    update,
};
