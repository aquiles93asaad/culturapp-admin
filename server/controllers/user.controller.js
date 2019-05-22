const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Company = require('../models/company.model');
const companyCtrl = require('./company.controller');
const _ = require('lodash');

async function check(userEmail, userDocId) {
    try {
        const user = await User.findOne({
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

async function create(user, reqUserCompany) {
    try {
        if(!user.userCompany)
            user['userCompany'] = reqUserCompany;

        if(!user.password)
            user['password'] = 'cloudesk';
        
        user.hashedPassword = bcrypt.hashSync(user.password, 10);
        delete user.password;
        const createdUser = await User(user).save();
        await companyCtrl.addUser(createdUser);
        return createdUser;
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
        
        // This finds users with filters received, unselecting the hashedPassword from all found users
        if(typeof filters.profiles !== 'undefined') {
            filters.profiles = { $in : filters.profiles };
        }

        if(typeof filters.roles !== 'undefined') {
            filters.roles = { $in : filters.roles };
        }

        if(typeof filters._id === 'undefined') {
            filters['_id'] = { $ne: reqUser._id };
        } else {
            filters['_id']['$ne'] = reqUser._id;
        }

        if (_.indexOf(reqUser.roles, 'SUPERVISOR') !== -1) {
            filters['_id']['$in'] = await User.find(
                { supervisor: reqUser._id },
                '_id'
            )
        }

        const users = await User.find(
            filters,
            '-hashedPassword'
        ).populate({ path: 'supervisor', model: User })
        .populate({ path: 'userCompany', model: Company })
        .populate({ path: 'createdBy', model: User, select: 'name lastName' })
        .populate({ path: 'modifiedBy', model: User, select: 'name lastName' });

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
        
        const user = await User.findOneAndUpdate(
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
