const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const CursoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    duracion: {
        type: Number,
        required: true
    },
    precio: {
        type: Number,
        required: true,
    },
    diasYHorarios: [{
        dia: String,
        horario: String
    }],
    nivel: {
        type: String
    },
    vacantes: {
        type: Number,
    },
    centro: {
        type: Schema.Types.ObjectId,
        ref: 'Curso'
    },
    materia:{
        type: Schema.Types.ObjectId,
        ref: 'Materia'
    },
    profesores: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    alumnos: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    asistencias: {
        type: [Schema.Types.ObjectId],
        ref: 'Asistencia'
    },
    notificaciones: {
        type: [Schema.Types.ObjectId],
        ref: 'Notificacion'
    }
}, {
    versionKey: false
});


module.exports = mongoose.model('Curso', CursoSchema);
