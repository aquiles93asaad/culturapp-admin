const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const MateriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
}, {
    versionKey: false
});


module.exports = mongoose.model('Materia', MateriaSchema);
