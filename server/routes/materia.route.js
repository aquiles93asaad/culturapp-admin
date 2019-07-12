const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const materiaCtrl = require('../controllers/materia.controller');
const requireAuth = require('../middleware/require-auth');

router.use(requireAuth);

router.route('/create').post(asyncHandler(create));
router.route('/get').post(asyncHandler(get));
router.route('/update').post(asyncHandler(update));
// router.route('/remove').post(asyncHandler(update));

module.exports = router;

async function create(req, res) {
    req.body.materia['createdBy'] = req.user._id;
    const materia = await materiaCtrl.create(req.body.materia);
    res.json({ materia });
}

async function get(req, res) {
    let filters;
    (typeof req.body.filters === 'undefined') ? filters = {} : filters = req.body.filters;
    const materias = await materiaCtrl.get(req.user, filters);
    res.json({ materias });
}

async function update(req, res) {
    req.body.materia['modifiedAt'] = new Date();
    req.body.materia['modifiedBy'] = req.user._id;
    const materia = await materiaCtrl.update(req.body.materia);
    res.json({ materia });
}