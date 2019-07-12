const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario.model');
const _ = require('lodash');

async function check(userEmail, userDocId) {
    try {
        const user = await Usuario.findOne({
            $or: [
                { email: userEmail },
                { documentId: userDocId}
            ]
        });
        if(user) {
            return true;
        } else {
            return false;
        }
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function create(user) {
    try {
        if(!user.password)
            user['password'] = 'cloudesk';
        
        user.hashedPassword = bcrypt.hashSync(user.password, 10);
        delete user.password;
        const createdUsuario = await Usuario(user).save();
        return createdUsuario;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function get(reqUsuario, filters) {
    try {
        if(typeof filters === 'undefined') {
            filters = {};
        }
        
        // This finds users with filters received, unselecting the hashedPassword from all found users
        // if(typeof filters.profiles !== 'undefined') {
        //     filters.profiles = { $in : filters.profiles };
        // }

        // if(typeof filters.roles !== 'undefined') {
        //     filters.roles = { $in : filters.roles };
        // }

        // if(typeof filters._id === 'undefined') {
        //     filters['_id'] = { $ne: reqUsuario._id };
        // } else {
        //     filters['_id']['$ne'] = reqUsuario._id;
        // }

        // if (_.indexOf(reqUsuario.roles, 'SUPERVISOR') !== -1) {
        //     filters['_id']['$in'] = await Usuario.find(
        //         { supervisor: reqUsuario._id },
        //         '_id'
        //     )
        // }

        console.log(filters);

        const users = await Usuario.find(
            filters,
            '-hashedPassword'
        );

        return users;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function update(userData) {
    try {
        if(userData.password) {
            userData.hashedPassword = bcrypt.hashSync(userData.password, 10);
            delete userData.password
        }
        
        const user = await Usuario.findOneAndUpdate(
            { _id: userData._id },
            userData,
            { new: true }
        );
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = {
    check,
    create,
    get,
    update,
};
