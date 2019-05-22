const GenericDemo = require('../models/generic-demo.model');
const User = require('../models/user.model');
const _ = require('lodash');

async function create(genericDemo) {
    try {
        const createdGenericDemo = await GenericDemo(genericDemo).save();
        return createdGenericDemo;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function get(filters) {
    try {
        const genericDemos = await GenericDemo.find(
            filters
        ).populate({ path: 'createdBy', model: User, select: 'name lastName' })
        .populate({ path: 'modifiedBy', model: User, select: 'name lastName' });
        return genericDemos;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function update(genericDemo) {
    try {
        const updatedGenericDemo = await GenericDemo.findOneAndUpdate(
            { _id: genericDemo._id },
            genericDemo,
            { new: true }
        );
        return updatedGenericDemo;
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
