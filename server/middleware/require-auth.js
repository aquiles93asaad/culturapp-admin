const passport = require('passport');
const _ = require('lodash');

const requireAuthenticationList = [
    'POST /api/asistencia/create',
    'POST /api/asistencia/get',
    'POST /api/asistencia/update',
    'POST /api/asistencia/remove',

    'POST /api/centro/create',
    'POST /api/centro/get',
    'POST /api/centro/update',
    'POST /api/centro/remove',

    'POST /api/curso/create',
    'POST /api/curso/get',
    'POST /api/curso/update',
    'POST /api/curso/remove',
    'POST /api/curso/addUserToCurso',

    'POST /api/materia/create',
    'POST /api/materia/get',
    'POST /api/materia/update',
    'POST /api/materia/remove',

    'POST /api/notificacion/create',
    'POST /api/notificacion/get',
    'POST /api/notificacion/update',
    'POST /api/notificacion/remove',

    'POST /api/user/create',
    'POST /api/user/get',
    'POST /api/user/update',
    'POST /api/user/remove',
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
