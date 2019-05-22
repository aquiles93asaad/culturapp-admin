const express = require('express');
const asyncHandler = require('express-async-handler')
const passport = require('passport');
const authCtrl = require('../controllers/auth.controller');
const companyCtrl = require('../controllers/company.controller');

const router = express.Router();
module.exports = router;

const REGISTER_CONSTANTS = {
    profile: 'ADMIN',
    role: 'LIDER'
}

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

/* 
    adds the company then the user
    req.body is expected to be
    {
        user: {},
        company: {}
    }
*/
async function register(req, res, next) {
    req.body.user['profiles'] = [REGISTER_CONSTANTS.profile];
    req.body.user['roles'] = [REGISTER_CONSTANTS.role];
    let user = await companyCtrl.createOnRegister(req.body.company, req.body.user);
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
