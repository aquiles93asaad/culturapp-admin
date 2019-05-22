const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const requireAuth = require('../middleware/require-auth');
const demoCtrl = require('../controllers/demo.controller');

router.use(requireAuth);

router.route('/create').post(asyncHandler(create));
router.route('/get').post(asyncHandler(get));
router.route('/update').post(asyncHandler(update));

module.exports = router;

async function create(req, res) {
    req.body.demo['createdBy'] = req.user._id;
    const demo = await demoCtrl.create(req.body.demo, req.body.opportunityId);
    res.json({ demo });
}

async function get(req, res) {
    let filters;
    (typeof req.body.filters === 'undefined') ? filters = {} : filters = req.body.filters;
    const demos = await demoCtrl.get(filters);
    res.json({ demos });
}

async function update(req, res) {
    req.body.demo['modifiedAt'] = new Date();
    req.body.demo['modifiedBy'] = req.user._id;
    const demo = await demoCtrl.update(req.body.demo);
    res.json({ demo });
}