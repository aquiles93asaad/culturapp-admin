const Constants = require('../models/constants.model');
const User = require('../models/user.model');
const _ = require('lodash');

async function check() {
    try {
        const constants = await Constants.findOne({
            isActive: true
        });

        if(constants) {
            return true;
        } else {
            return false;
        }
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function create(constants) {
    try {
        if(constants.isActive) {
            await Constants.updateMany(
                { isActive: true },
                { isActive: false }
            )
        }

        const createdConstants = await Constants(constants).save();
        return createdConstants;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function get(filters) {
    try {
        const constants = await Constants.find(
            filters
        ).populate({ path: 'createdBy', model: User, select: 'name lastName' })
        .populate({ path: 'modifiedBy', model: User, select: 'name lastName' });
        return constants;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function update(constants) {
    try {
        if(constants.isActive) {
            await Constants.updateMany(
                { isActive: true },
                { isActive: false }
            )
        }

        const updatedConstants = await Constants.findOneAndUpdate(
            { _id: constants._id },
            constants,
            { new: true }
        );
        return updatedConstants;
    } catch(error) {
        console.log(error);
        return error;
    }
}

module.exports = {
    check,
    create,
    get,
    update
};
