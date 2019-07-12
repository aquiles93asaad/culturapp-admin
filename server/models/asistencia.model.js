const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const AsistenciaSchema = new mongoose.Schema({
    fechaClase: {
        type: Date,
        required: true
    },
    presentes: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    ausentes: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
}, {
    versionKey: false
});


module.exports = mongoose.model('Asistencia', AsistenciaSchema);
