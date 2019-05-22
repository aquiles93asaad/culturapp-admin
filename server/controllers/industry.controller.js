const Industry = require('../models/industry.model');
const User = require('../models/user.model');
const _ = require('lodash');

async function create(industry) {
    try {
        const createdIndustry = await Industry(industry).save();
        return createdIndustry;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function get(filters) {
    try {
        const industries = await Industry.find(
            filters
        ).populate({ path: 'createdBy', model: User, select: 'name lastName' })
        .populate({ path: 'modifiedBy', model: User, select: 'name lastName' });
        return industries;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function update(industry) {
    try {
        const updatedindustries = await Industry.findOneAndUpdate(
            { _id: industry._id },
            industry,
            { new: true }
        );
        return updatedindustries;
    } catch(error) {
        console.log(error);
        return error;
    }
}

module.exports = {
    create,
    get,
    update
};