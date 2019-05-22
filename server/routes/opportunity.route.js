const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const requireAuth = require('../middleware/require-auth');
const opportunityCtrl = require('../controllers/opportunity.controller');

router.use(requireAuth);

router.route('/create').post(asyncHandler(create));
router.route('/get').post(asyncHandler(get));
router.route('/update').post(asyncHandler(update));
router.route('/remove').post(asyncHandler(remove));

module.exports = router;

async function create(req, res) {
    req.body.opportunity['createdBy'] = req.user._id;
    const opportunity = await opportunityCtrl.create(req.body.opportunity);
    res.json({ opportunity });
}

async function get(req, res) {
    let filters, onlyUserOpportunities;
    (typeof req.body.filters === 'undefined') ? filters = {} : filters = req.body.filters;
    (typeof req.body.onlyUserOpportunities === 'undefined') ? onlyUserOpportunities = false : onlyUserOpportunities = req.body.onlyUserOpportunities;
    const opportunities = await opportunityCtrl.get(filters, req.user, onlyUserOpportunities);
    res.json({ opportunities });
}

async function update(req, res) {
    req.body.opportunity['modifiedAt'] = new Date();
    req.body.opportunity['modifiedBy'] = req.user._id;
    const opportunity = await opportunityCtrl.update(req.body.opportunity);
    res.json({ opportunity });
}

async function remove(req, res) {
    const opportunity = await opportunityCtrl.remove(req.body.opportunity);
    res.json({ opportunity });
}