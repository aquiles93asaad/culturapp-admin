const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const CursoSchema = new mongoose.Schema({
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    duracion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true,
    },
    horario:{
        type: [String],
        required: true,
        validate: v => v == null || v.length > 0
    },
    dia: {
        type: [String],
        required: true,
        validate: v => v == null || v.length > 0
    },
    materia:{
        type: [Schema.Types.ObjectId],
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
