const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const cursoCtrl = require('../controllers/curso.controller');
const requireAuth = require('../middleware/require-auth');

router.use(requireAuth);

router.route('/create').post(asyncHandler(create));
router.route('/get').post(asyncHandler(get));
router.route('/update').post(asyncHandler(update));
// router.route('/remove').post(asyncHandler(update));

module.exports = router;

async function create(req, res) {
    req.body.curso['centro'] = req.user.centroAdmin._id;
    const curso = await cursoCtrl.create(req.body.curso);
    res.json({ curso });
}

async function get(req, res) {
    let filters;
    (typeof req.body.filters === 'undefined') ? filters = {} : filters = req.body.filters;
    const cursos = await cursoCtrl.get(req.user, filters);
    res.json({ cursos });
}

async function update(req, res) {
    const curso = await cursoCtrl.update(req.body.curso);
    res.json({ curso });
}