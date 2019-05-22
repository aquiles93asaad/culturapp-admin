const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const requireAuth = require('../middleware/require-auth');
const industryCtrl = require('../controllers/industry.controller');

router.use(requireAuth);

router.route('/create').post(asyncHandler(create));
router.route('/get').post(asyncHandler(get));
router.route('/update').post(asyncHandler(update));

module.exports = router;

async function create(req, res) {
    req.body.industry['createdBy'] = req.user._id;
    const industry = await industryCtrl.create(req.body.industry);
    res.json({ industry });
}

async function get(req, res) {
    let filters;
    (typeof req.body.filters === 'undefined') ? filters = {} : filters = req.body.filters;
    const industries = await industryCtrl.get(filters);
    res.json({ industries });
}

async function update(req, res) {
    req.body.industry['modifiedAt'] = new Date();
    req.body.industry['modifiedBy'] = req.user._id;
    const industry = await industryCtrl.update(req.body.industry);
    res.json({ industry });
}