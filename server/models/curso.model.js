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
    dia: {
        type: String,
        required: true
        // validate: v => v == null || v.length > 0
    },
    horario: {
        type: Date,
        required: true
        // validate: v => v == null || v.length > 0
    },
    nivel: {
        type: String
    },
    centro: {
        type: Schema.Types.ObjectId,
        ref: 'Curso'
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
