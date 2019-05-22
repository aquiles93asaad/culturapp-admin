const passport = require('passport');
const _ = require('lodash');

const requireAuthenticationList = [
    'POST /api/company/create',
    'POST /api/company/get',
    'POST /api/company/update',
    'POST /api/company/add-user',
    'POST /api/company/add-sales-channel',
    'POST /api/user/create',
    'POST /api/user/get',
    'POST /api/user/update',
    'POST /api/user/remove',
    'POST /api/opportunity/create',
    'POST /api/opportunity/get',
    'POST /api/opportunity/update',
    'POST /api/opportunity/remove',
    'POST /api/solution/create',
    'POST /api/solution/get',
    'POST /api/solution/update',
    'POST /api/solution/remove',
    'POST /api/demo/create',
    'POST /api/demo/get',
    'POST /api/demo/update',
    'POST /api/proposal/create',
    'POST /api/proposal/get',
    'POST /api/proposal/update',
    'POST /api/proposal/remove',
    'POST /api/proposal/breakdown',
    'GET /api/constants/check',
    'POST /api/constants/create',
    'POST /api/constants/get',
    'POST /api/constants/update',
    'POST /api/generic-demo/create',
    'POST /api/generic-demo/get',
    'POST /api/generic-demo/update',
    'POST /api/generic-demo/remove',
    'POST /api/industry/create',
    'POST /api/industry/get',
    'POST /api/industry/update',
    'POST /api/industry/remove',
];

const requireAuthentication = function(request, response, next) {
    let route = `${request.method} ${request.originalUrl}`;
    
    if (_.indexOf(requireAuthenticationList, route) === -1) {
        next();
    } else {
        passport.authenticate('jwt', { session: false })(request, response, next);
    }
}

module.exports = requireAuthentication;
