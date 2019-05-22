const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const genericDemoRoutes = require('./generic-demo.route');
const constantsRoutes = require('./constants.route');
const companyRoutes = require('./company.route');
const demoRoutes = require('./demo.route');
const proposalRoutes = require('./proposal.route');
const opportunityRoutes = require('./opportunity.route');
const solutionRoutes = require('./solution.route');
const industryRoutes = require('./industry.route');

require('../models/user.model');
require('../models/constants.model');
require('../models/generic-demo.model');
require('../models/solution.model');
require('../models/company.model');
require('../models/demo.model');
require('../models/proposal.model');
require('../models/opportunity.model');
require('../models/industry.model');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
    res.send('OK')
);

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/company', companyRoutes);
router.use('/opportunity', opportunityRoutes);
router.use('/demo', demoRoutes);
router.use('/proposal', proposalRoutes);
router.use('/solution', solutionRoutes);
router.use('/generic-demo', genericDemoRoutes);
router.use('/constants', constantsRoutes);
router.use('/industry', industryRoutes);

module.exports = router;
