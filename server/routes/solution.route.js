const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const requireAuth = require('../middleware/require-auth');
const solutionCtrl = require('../controllers/solution.controller');

router.use(requireAuth);

router.route('/create').post(asyncHandler(create));
router.route('/get').post(asyncHandler(get));
router.route('/update').post(asyncHandler(update));

module.exports = router;

async function create(req, res) {
    req.body.solution['createdBy'] = req.user._id;
    const solution = await solutionCtrl.create(req.body.solution);
    res.json({ solution });
}

async function get(req, res) {
    let filters;
    (typeof req.body.filters === 'undefined') ? filters = {} : filters = req.body.filters;
    const solutions = await solutionCtrl.get(filters);
    res.json({ solutions });
}

async function update(req, res) {
    req.body.solution['modifiedBy'] = req.user._id;
    req.body.solution['modifiedAt'] = new Date();
    const solution = await solutionCtrl.update(req.body.solution);
    res.json({ solution });
}
