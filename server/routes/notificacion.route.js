const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const notificacionCtrl = require('../controllers/notificacion.controller');
const requireAuth = require('../middleware/require-auth');

router.use(requireAuth);

router.route('/create').post(asyncHandler(create));
router.route('/get').post(asyncHandler(get));
router.route('/update').post(asyncHandler(update));
// router.route('/remove').post(asyncHandler(update));

module.exports = router;

async function create(req, res) {
    const notificacion = await notificacionCtrl.create(req.body.notificacion);
    res.json({ notificacion });
}

async function get(req, res) {
    let filters;
    (typeof req.body.filters === 'undefined') ? filters = {} : filters = req.body.filters;
    const notificacions = await notificacionCtrl.get(req.user, filters);
    res.json({ notificacions });
}

async function update(req, res) {
    const notificacion = await notificacionCtrl.update(req.body.notificacion);
    res.json({ notificacion });
}