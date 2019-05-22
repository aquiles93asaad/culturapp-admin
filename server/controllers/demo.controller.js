const Demo = require('../models/demo.model');
const opportunityCtrl = require('./opportunity.controller');
const _ = require('lodash');

async function create(demo, opportunityId) {
    try {
        const createdDemo = await Demo(demo).save();
        await opportunityCtrl.addDemo(createdDemo, opportunityId);
        return createdDemo;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function get(filters) {
    try {
        const demo = await Demo().find(
            filters
        ).populate({ path: 'createdBy', model: User, select: 'name lastName' })
        .populate({ path: 'modifiedBy', model: User, select: 'name lastName' });
        return demo;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function update(demoData) {
    try {
        const demo = await Demo.findOneAndUpdate(
            { _id: demoData._id },
            demoData,
            { new: true }
        );
        return demo;
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = {
    create,
    get,
    update
};
