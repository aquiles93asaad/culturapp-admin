const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const AsistenciaSchema = new mongoose.Schema({
    fechaClase: {
        type: Date,
        required: true
    },
    estado: {
        type: String,
        default: 'Sin cargar'
    },
    esFeriado: {
        type: Boolean,
        default: false
    },
    presentes: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    ausentes: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    curso: {
        type: Schema.Types.ObjectId,
        ref: 'Curso'
    },
}, {
    versionKey: false
});


module.exports = mongoose.model('Asistencia', AsistenciaSchema);
