const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const requireAuth = require('../middleware/require-auth');
const constantsCtrl = require('../controllers/constants.controller');

router.use(requireAuth);

router.route('/check').get(asyncHandler(check));
router.route('/create').post(asyncHandler(create));
router.route('/get').post(asyncHandler(get));
router.route('/update').post(asyncHandler(update));

module.exports = router;

async function check(req, res) {
    const isThereActiveConstants = await constantsCtrl.check();
    res.send({ isThereActiveConstants });
}

async function create(req, res) {
    req.body.constants['createdBy'] = req.user._id;
    const constants = await constantsCtrl.create(req.body.constants);
    res.json({ constants });
}

async function get(req, res) {
    let filters;
    (typeof req.body.filters === 'undefined') ? filters = {} : filters = req.body.filters;
    const constants = await constantsCtrl.get(filters);
    res.json({ constants });
}

async function update(req, res) {
    req.body.constants['modifiedAt'] = new Date();
    req.body.constants['modifiedBy'] = req.user._id;
    const constants = await constantsCtrl.update(req.body.constants);
    res.json({ constants });
}