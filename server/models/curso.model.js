const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const CursoSchema = new mongoose.Schema({
    nombre: {
        type: String,
    },
    descripcion: {
        type: String,
    },
    fechaInicio: {
        type: Date,
    },
    fechaFin: {
        type: Date,
    },
    precio: {
        type: Number,
    },
    diasYHorarios: [{
        dia: String,
        horarioDesde: String,
        horarioHasta: String
    }],
    nivel: {
        type: String
    },
    vacantes: {
        type: Number,
    },
    sede: {
        localidad: String,
        direccion: String,
        nombre: String,
        _id: String
    },
    centro: {
        type: Schema.Types.ObjectId,
        ref: 'Centro'
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
