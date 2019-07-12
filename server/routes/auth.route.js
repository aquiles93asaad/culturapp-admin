const express = require('express');
const asyncHandler = require('express-async-handler')
const passport = require('passport');
const authCtrl = require('../controllers/auth.controller');
const userCtrl = require('../controllers/user.controller');

const router = express.Router();
module.exports = router;

router.post('/login', function (req, res, next) {
    passport.authenticate('local', { session: false }, function(err, user, info){
        login(err, user, info, res, next);
    })(req, res, next);
});

router.get('/me', function (req, res, next) {
    passport.authenticate('jwt', { session: false }, function(err, user, info){
        login(err, user, info, res, next);
    })(req, res, next);
});

router.post('/register', asyncHandler(register), function(req, res) {
    const user = req.user;
    const token = authCtrl.generateToken(user);
    res.json({ user, token });
});

async function register(req, res, next) {
    let user = await userCtrl.create(req.body.user);
    delete user.hashedPassword;
    req.user = user;
    next();
}

function login(err, user, info, res, next) {
    if (err) {
        console.log(err);
        return next(err);
    }

    if (!user) {
        return res.json(info)
    }

    const token = authCtrl.generateToken(user);
    res.json({ user, token });
}
