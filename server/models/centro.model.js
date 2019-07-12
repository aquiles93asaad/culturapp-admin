const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const CentroSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    profesores: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    cursos: {
        type: [Schema.Types.ObjectId],
        ref: 'Curso'
    }
}, {
    versionKey: false
});


module.exports = mongoose.model('Centro', CentroSchema);
