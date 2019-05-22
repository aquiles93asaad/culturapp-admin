const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const requireAuth = require('../middleware/require-auth');
const companyCtrl = require('../controllers/company.controller');

router.use(requireAuth);

router.route('/check').post(asyncHandler(check));
router.route('/create').post(asyncHandler(create));
router.route('/get').post(asyncHandler(get));
router.route('/update').post(asyncHandler(update));
router.route('/add-user').post(asyncHandler(addUser));
router.route('/add-sales-channel').post(asyncHandler(addSalesChannel));
router.route('/remove').post(asyncHandler(remove));

module.exports = router;

async function check(req, res) {
    let companyExists = await companyCtrl.check(req.body.name, req.body.cuit);
    res.send({ companyExists });
}

async function create(req, res) {
    req.body.company['createdBy'] = req.user._id;
    let company = await companyCtrl.create(req.body.company);
    
    if(company && !company.errors) {
        res.json({ company });
    } else {
        if(typeof company.code !== 'undefined' && company.code == 11000) {
            res.json({ errorMessage: "Una empresa con este nombre y/o cuit ya existe", errorType: 'company-exists' });
        } else if(typeof company.name !== 'undefined' && company.name == 'ValidationError') {
            res.json({ errorMessage: company.message, errorType: 'validation-error' });
        }
    }
}

async function get(req, res) {
    let companies = await companyCtrl.get(req.user.companyId, req.body.filters);
    res.json({ companies });
}

async function update(req, res) {
    req.body.company['modifiedAt'] = new Date();
    req.body.company['modifiedBy'] = req.user._id;
    let company = await companyCtrl.update(req.body.company);
    res.json({ company });
}

async function addUser(req, res) {
    let company = await companyCtrl.addUser(req.body.user);
    res.json({ company });
}

async function addSalesChannel(req, res) {
    req.body.company['salesChannelOf'] = req.user.userCompany._id;
    req.body.company['createdBy'] = req.user._id;
    let company = await companyCtrl.addSalesChannel(req.body.company);
    res.json({ company });
}

async function remove(req, res) {
    req.body.company['salesChannelOf'] = req.user.userCompany._id;
    req.body.company['createdBy'] = req.user._id;
    let company = await companyCtrl.addSalesChannel(req.body.company);
    res.json({ company });
}