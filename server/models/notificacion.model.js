const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const NotificacionSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
}, {
    versionKey: false
});


module.exports = mongoose.model('Notificacion', NotificacionSchema);
