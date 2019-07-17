const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario.model');
const Centro = require('../models/centro.model');
const _ = require('lodash');

async function check(userEmail, userDocId) {
    try {
        let filters = {};
        if(typeof userDocId !== 'undefined') {
            filters = {
                $or: [
                    { email: userEmail },
                    { dni: userDocId }
                ]
            }
        } else {
            filters =  { email: userEmail };
        }

        const user = await Usuario.findOne(filters);
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
            user['password'] = 'culturapp';
        
        user.hashedPassword = bcrypt.hashSync(user.password, 10);
        delete user.password;
        const createdUsuario = await Usuario(user).save();
        return createdUsuario;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function get(reqUser, filters) {
    try {
        if(typeof filters === 'undefined') {
            filters = {};
        }

        const users = await Usuario.find(
            filters,
            '-hashedPassword'
        ).populate({ path: 'centro', model: Centro });
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
