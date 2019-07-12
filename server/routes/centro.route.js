const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const centroCtrl = require('../controllers/centro.controller');
const requireAuth = require('../middleware/require-auth');

router.use(requireAuth);

router.route('/create').post(asyncHandler(create));
router.route('/get').post(asyncHandler(get));
router.route('/update').post(asyncHandler(update));
// router.route('/remove').post(asyncHandler(update));

module.exports = router;

async function create(req, res) {
    const centro = await centroCtrl.create(req.body.centro);
    res.json({ centro });
}

async function get(req, res) {
    let filters;
    (typeof req.body.filters === 'undefined') ? filters = {} : filters = req.body.filters;
    const centros = await centroCtrl.get(filters);
    res.json({ centros });
}

async function update(req, res) {
    req.body.centro['modifiedAt'] = new Date();
    req.body.centro['modifiedBy'] = req.user._id;
    const centro = await centroCtrl.update(req.body.centro);
    res.json({ centro });
}