const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const userCtrl = require('../controllers/user.controller');
const requireAuth = require('../middleware/require-auth');

router.use(requireAuth);

router.route('/check').post(asyncHandler(check));
router.route('/create').post(asyncHandler(create));
router.route('/get').post(asyncHandler(get));
router.route('/update').post(asyncHandler(update));

module.exports = router;

async function check(req, res) {
    const userExists = await userCtrl.check(req.body.email, req.body.documentId);
    res.send({ userExists });
}

async function create(req, res) {
    req.body.user['createdBy'] = req.user._id;
    const user = await userCtrl.create(req.body.user);
    res.json({ user });
}

async function get(req, res) {
    let filters;
    (typeof req.body.filters === 'undefined') ? filters = {} : filters = req.body.filters;
    const users = await userCtrl.get(req.user, filters);
    res.json({ users });
}

async function update(req, res) {
    req.body.user['modifiedAt'] = new Date();
    req.body.user['modifiedBy'] = req.user._id;
    const user = await userCtrl.update(req.body.user);
    res.json({ user });
}