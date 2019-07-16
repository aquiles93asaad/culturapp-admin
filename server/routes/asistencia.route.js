const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const asistenciaCtrl = require('../controllers/asistencia.controller');
const requireAuth = require('../middleware/require-auth');

router.use(requireAuth);

router.route('/create').post(asyncHandler(create));
router.route('/get').post(asyncHandler(get));
router.route('/update').post(asyncHandler(update));
// router.route('/remove').post(asyncHandler(update));

module.exports = router;

async function create(req, res) {
    const asistencia = await asistenciaCtrl.create(req.body.asistencia);
    res.json({ asistencia });
}

async function get(req, res) {
    let filters;
    (typeof req.body.filters === 'undefined') ? filters = {} : filters = req.body.filters;
    const asistencias = await asistenciaCtrl.get(req.user, filters);
    res.json({ asistencias });
}

async function update(req, res) {
    const asistencia = await asistenciaCtrl.update(req.body.asistencia);
    res.json({ asistencia });
}