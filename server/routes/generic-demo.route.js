const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const requireAuth = require('../middleware/require-auth');
const genericDemoCtrl = require('../controllers/generic-demo.controller');

router.use(requireAuth);

router.route('/create').post(asyncHandler(create));
router.route('/get').post(asyncHandler(get));
router.route('/update').post(asyncHandler(update));

module.exports = router;

async function create(req, res) {
    req.body.genericDemo['createdBy'] = req.user._id;
    const genericDemo = await genericDemoCtrl.create(req.body.genericDemo);
    res.json({ genericDemo });
}

async function get(req, res) {
    let filters;
    (typeof req.body.filters === 'undefined') ? filters = {} : filters = req.body.filters;
    const genericDemos = await genericDemoCtrl.get(filters);
    res.json({ genericDemos });
}

async function update(req, res) {
    req.body.genericDemo['modifiedAt'] = new Date();
    req.body.genericDemo['modifiedBy'] = req.user._id;
    const genericDemo = await genericDemoCtrl.update(req.body.genericDemo);
    res.json({ genericDemo });
}