const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const requireAuth = require('../middleware/require-auth');
const proposalCtrl = require('../controllers/proposal.controller');

router.use(requireAuth);

router.route('/create').post(asyncHandler(create));
router.route('/get').post(asyncHandler(get));
router.route('/update').post(asyncHandler(update));
router.route('/remove').post(asyncHandler(remove));
router.route('/breakdown').post(asyncHandler(breakdown));

module.exports = router;

async function create(req, res) {
    req.body.proposal['createdBy'] = req.user._id;
    const proposal = await proposalCtrl.create(req.body.proposal, req.body.opportunityId);
    res.json({ proposal });
}

async function get(req, res) {
    let filters;
    (typeof req.body.filters === 'undefined') ? filters = {} : filters = req.body.filters;
    const proposals = await proposalCtrl.get(filters, req.user);
    res.json({ proposals });
}

async function update(req, res) {
    req.body.proposal['modifiedAt'] = new Date();
    req.body.proposal['modifiedBy'] = req.user._id;
    const proposal = await proposalCtrl.update(req.body.proposal, req.body.opportunityId);
    res.json({ proposal });
}

async function remove(req, res) {
    const proposal = await proposalCtrl.remove(req.body.proposal, req.body.opportunityId);
    res.json({ proposal });
}

async function breakdown(req, res) {
    const breakdown = await proposalCtrl.breakdown(req.body.proposal);
    res.json({ breakdown });
}