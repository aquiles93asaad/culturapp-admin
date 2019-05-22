const Company = require('../models/company.model');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

async function createOnRegister(company, user) {
    try {
        let createdCompany = await Company(company).save();
        user['userCompany'] = createdCompany._id;
        user.hashedPassword = bcrypt.hashSync(user.password, 10);
        delete user.password;
        const createdUser = await User(user).save();
        await addUser(createdUser);
        return createdUser;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function check(name, cuit) {
    try {
        const company = await Company.findOne({
            $or: [
                { name: name },
                { cuit: cuit }
            ]
        });
        if(company) {
            return true;
        } else {
            return false;
        }
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function create(companyData) {
    try {
        const company = await Company(companyData).save();
        return company;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function get(companyId, filters) {
    try {
        if(typeof filters === 'undefined') {
            filters = {};
            filters['_id'] = { $ne: companyId }
        }

        const companies = await Company.find(
            filters
        ).populate({ path: 'users', model: User })
        .populate({ path: 'salesChannelOf', model: Company })
        .populate({ path: 'createdBy', model: User, select: 'name lastName' })
        .populate({ path: 'modifiedBy', model: User, select: 'name lastName' });

        return companies;
    } catch(error){
        console.log(error);
        return error;
    }
}

async function update(companyData) {
    try {
        const company = await Company.findOneAndUpdate(
            { _id: companyData._id },
            companyData,
            { new: true }
        );
        return company;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function addUser(user) {
    try {
        const company = await Company.findOneAndUpdate(
            { _id: user.userCompany },
            { $push: { users: user._id } }
        );
        return company;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function addSalesChannel(saleChannel) {
    try {
        const createdChannel = await Company(saleChannel).save();
        await Company.findOneAndUpdate(
            { _id: createdChannel.salesChannelOf },
            { $push: { salesChannels: createdChannel._id } }
        );
    
        return createdChannel;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function remove(company) {
    
}

module.exports = {
    createOnRegister,
    check,
    create,
    get,
    update,
    addUser,
    addSalesChannel,
    remove
};
