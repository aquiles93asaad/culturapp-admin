const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const UsuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
    },
    dni: {
        type: Number,
        unique: true,
        required: true
    },
    fechaNacimiento: {
        type: Date,
    },
    sexo: {
        type: String
    },
    telefono: {
        type: String
    },
    direccion: {
        type: String
    },
    hashedPassword: {
        type: String,
        required: true
    },
    esProfesor: {
        type: Boolean
    },
    esAdmin: {
        type: Boolean
    },
    centro: {
        type: Schema.Types.ObjectId,
        ref: 'Centro'
    },
    esSuperAdmin: {
        type: Boolean
    },
    cursosInscriptos: {
        type: [Schema.Types.ObjectId],
        ref: 'Curso'
    }
}, {
        versionKey: false
    });


module.exports = mongoose.model('Usuario', UsuarioSchema);
