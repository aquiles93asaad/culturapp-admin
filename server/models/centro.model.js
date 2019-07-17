const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const CentroSchema = new mongoose.Schema({
    nombre: {
        type: String,
    },
    descripcion: {
        type: String,
    },
    telefono: {
        type: String
    },
    sedes: [{
        localidad: String,
        direccion: String,
        nombre: String
    }],
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
