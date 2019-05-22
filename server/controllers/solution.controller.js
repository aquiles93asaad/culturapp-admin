const Solution = require('../models/solution.model');
const User = require('../models/user.model');
const _ = require('lodash');

async function create(solution) {
    try {
        const createdSolution = await Solution(solution).save();
        return createdSolution;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function get(filters) {
    try {
        const solutions = await Solution.find(
            filters
        ).populate({ path: 'createdBy', model: User, select: 'name lastName' })
        .populate({ path: 'modifiedBy', model: User, select: 'name lastName' });
        return solutions;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function update(solution) {
    try {
        const updatedSolution = await Solution.findOneAndUpdate(
            { _id: solution._id },
            solution,
            { new: true }
        );
        return updatedSolution;
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
