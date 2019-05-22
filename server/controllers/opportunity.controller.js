const Opportunity = require('../models/opportunity.model');
const Company = require('../models/company.model');
const User = require('../models/user.model');
const Demo = require('../models/demo.model');
const Proposal = require('../models/proposal.model');
const Solution = require('../models/solution.model');
const _ = require('lodash');

async function create(opportunity) {
    try {
        const createdOpportunity = await Opportunity(opportunity).save();
        return createdOpportunity;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function get(filters, user, onlyUserOpportunities) {
    try {
        let users = [];
        let saleChannelsUsers = [];
        let saleChannelsIds = [];

        if (_.indexOf(user.roles, 'LIDER') !== -1 && !onlyUserOpportunities) {
            users = await User.find(
                { userCompany: user.userCompany._id },
                '_id'
            )
        } else if (_.indexOf(user.roles, 'SUPERVISOR') !== -1 && !onlyUserOpportunities) {
            users = await User.find(
                { userCompany: user.userCompany._id, supervisor: user._id },
                '_id'
            )
        }

        if(!onlyUserOpportunities) {
            if(user.userCompany.salesChannelOf) {
                // Parado en nivel 1. "Ejemplo: xerox" me aseguro que no es un subcanal de venta, agrego los ids de los canales de venta de este usuario que es un usuario de un canal de venta
                if(typeof user.userCompany.salesChannelOf.salesChannelOf === 'undefined') {
                    for (let i = 0; i < user.userCompany.salesChannels.length; i++) {
                        saleChannelsIds.push(user.userCompany.salesChannels[i]._id);
                    }
                }
            } else {
                // Parado en nivel 0. "Ejemplo: vivatia"
                for (let i = 0; i < user.userCompany.salesChannels.length; i++) {
                    saleChannelsIds.push(user.userCompany.salesChannels[i]._id);
                    for (let j = 0; j < user.userCompany.salesChannels[i].salesChannels.length; j++) {
                        saleChannelsIds.push(user.userCompany.salesChannels[i].salesChannels[j]);
                    }
                }
            }

            saleChannelsUsers = await User.find(
                { userCompany: { $in: saleChannelsIds }},
                '_id'
            )
        }
        const opportunities = await Opportunity.find({
            $and: [
                filters,
                {
                    $or: [
                        { createdBy: user._id },
                        { assignedTo: user._id },
                        { createdBy: { $in: users.concat(saleChannelsUsers) } }
                    ]
                }
            ]
        }).populate({ path: 'companyClient', model: Company })
        .populate({ path: 'createdBy', model: User, select: 'name lastName userCompany', populate: [{ path: 'userCompany', Model: Company, select: 'name' }]})
        .populate({ path: 'modifiedBy', model: User, select: 'name lastName' })
        .populate({ path: 'assignedTo', model: User, select: 'name lastName' })
        .populate({ path: 'opportunityDemo', model: Demo })
        .populate({ path: 'opportunityProposals', model: Proposal, populate: [{ path: 'chosenSolution', Model: Solution}, {path: 'createdBy', Model: User, select: 'name lastName' }]});

        return opportunities;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function update(opportunityData) {
    try {
        const opportunity = await Opportunity.findOneAndUpdate(
            { _id: opportunityData._id },
            opportunityData,
            { new: true }
        );
        return opportunity;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function addProposal(proposal, opportunityId) {
    try {
        // In case the proposal must be created
        if(!proposal._id) {
            proposal = await Proposal(proposal).save();
        }

        const company = await Opportunity.findOneAndUpdate(
            { _id: opportunityId },
            { 
                estimatedTotal: proposal.estimatedTotal,
                $push: { opportunityProposals: proposal._id }
            },
            { new: true }
        );
        return company;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function addDemo(demo, opportunityId) {
    try {
        // In case the demo must be created
        if(!demo._id) {
            demo = await Demo(demo).save();
        }

        const company = await Opportunity.findOneAndUpdate(
            { _id: opportunityId },
            { opportunityDemo: demo._id },
            { new: true }
        );
        return company;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function removeProposal(proposalId, opportunityId) {
    try {
        const company = await Opportunity.findOneAndUpdate(
            { _id: opportunityId },
            { $pull: { opportunityProposals: proposalId } },
            { new: true }
        );
        return company;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function remove(opportunity) {
    try {
        if(opportunity.opportunityProposals.length != 0) {
            let proposalsIds = [];
            for (let i = 0; i < opportunity.opportunityProposals.length; i++) {
                proposalsIds.push(opportunity.opportunityProposals[i]._id);
            }
            
            await Proposal.remove(
                { _id: { $in: opportunity.opportunityProposals }},
            );
        }
        
        if(opportunity.opportunityDemo) {
            await Demo.remove(
                { _id: opportunity.opportunityDemo._id }
            );
        }

        const result = await Opportunity.findOneAndDelete(
            { _id: opportunity._id },
        );
        
        return result;
    } catch(error) {
        console.log(error);
        return error;
    }
}

module.exports = {
    create,
    get,
    update,
    addProposal,
    addDemo,
    removeProposal,
    remove
};
