const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const asistenciaRoutes = require('./asistencia.route');
const centroRoutes = require('./centro.route');
const cursoRoutes = require('./curso.route');
const materiaRoutes = require('./materia.route');
const notificacionRoutes = require('./notificacion.route');

require('../models/usuario.model');
require('../models/asistencia.model');
require('../models/centro.model');
require('../models/curso.model');
require('../models/materia.model');
require('../models/notificacion.model');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
    res.send('OK')
);

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/asistencia', asistenciaRoutes);
router.use('/centro', centroRoutes);
router.use('/curso', cursoRoutes);
router.use('/materia', materiaRoutes);
router.use('/notificacion', notificacionRoutes);

module.exports = router;
