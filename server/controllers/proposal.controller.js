const Proposal = require('../models/proposal.model');
const User = require('../models/user.model');
const Opportunity = require('../models/opportunity.model');
const Company = require('../models/company.model');
const Constants = require('../models/constants.model');
const Solution = require('../models/solution.model');
const opportunityCtrl = require('./opportunity.controller');
const _ = require('lodash');

async function create(proposal, opportunityId) {
    try {
        const opportunity = await Opportunity.findById(opportunityId).populate({ path: 'companyClient', model: Company });
        const constants = await Constants.findOne({ isActive: true });
        let chosenSolution = null;
        if(proposal.chosenSolution != 'other') {
            chosenSolution = await Solution.findById(proposal.chosenSolution);
        } else {
            chosenSolution = 'other';
        }
        proposal['estimatedTotal'] = calculateTotal(proposal, constants, opportunity, chosenSolution);
        proposal['usedConstants'] = constants._id;
        proposal['isChosenProposal'] = true;
        await Proposal.updateMany({}, { isChosenProposal: false });
        const createdProposal = await Proposal(proposal).save();
        await opportunityCtrl.addProposal(createdProposal, opportunityId);
        return createdProposal;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function get(filters) {
    try {
        const solutions = await Proposal.find(
            filters
        ).populate({ path: 'createdBy', model: User, select: 'name lastName' })
        .populate({ path: 'modifiedBy', model: User, select: 'name lastName' })
        .populate({ path: 'chosenSolution', model: Solution });

        return solutions;
    } catch(error){
        console.log(error);
        return error;
    }
}

async function update(proposalData, opportunityId) {
    try {
        if(proposalData.isChosenProposal) {
            await opportunityCtrl.update({ _id: opportunityId, estimatedTotal: proposalData.estimatedTotal });
            await Proposal.updateMany(
                { _id: { $ne: proposalData._id } },
                { isChosenProposal: false }
            )
        }

        const proposal = await Proposal.findOneAndUpdate(
            { _id: proposalData._id },
            proposalData,
            { new: true }
        );
        return proposal;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function remove(proposal, opportunityId) {
    try {
        if(proposal.isChosenProposal) {
            await opportunityCtrl.update({ _id: opportunityId, estimatedTotal: null });
        }
        
        await opportunityCtrl.removeProposal(proposal._id, opportunityId);
        const result = await Proposal.findOneAndDelete(
            { _id: proposal._id },
        );
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function breakdown(proposal) {
    try {
        console.log(proposal.usedConstants);
        const constants = await Constants.findById(proposal.usedConstants);
        const breakdown = getProposalBreakdown(proposal, constants);
        return breakdown;
    } catch (error) {
        console.log(error);
        return error;
    }
}

function calculateTotal(proposal, constants, opportunity, chosenSolution) {
    let total = 0;

    if (proposal.newLicenses) {
        total = total + (proposal.newThLicenses * constants.thubanLicense) + (proposal.newCkLicenses * constants.capitkaLicense);
        total = total + (proposal.newThLicenses * constants.thubanMaintenance * proposal.contractDuration) + (proposal.newCkLicenses * constants.captikaMaintenance * proposal.contractDuration);
    }

    if (chosenSolution && typeof chosenSolution !== 'string') {
        let hoursType = '';
        switch (opportunity.companyClient.type) {
            case 'small':
                hoursType = 'hoursSmall';
                break;
            case 'medium':
                hoursType = 'hoursMedium';
                break;
            case 'big':
                hoursType = 'hoursBig';
                break;
        }
        total = total + (chosenSolution[hoursType] * constants.hourValue);
    }

    if (chosenSolution && typeof chosenSolution === 'string') {
        // Cantidad de horas que suman las respsuestas de las preguntas especificias cuando la solución es customizada. 16 horas de base para la instalación, y 80 análisis y especificación
        let consultingHours = constants.installation + constants.analisis;
        if (opportunity.digitization) {
            consultingHours = consultingHours + (proposal.digitization_docTypes * constants.docTypeHours) + (proposal.digitization_autoRecognitionDocs * constants.autoRecognitionDocHours);
        }

        if (opportunity.docManager) {
            consultingHours = consultingHours + (proposal.docManager_docsClasses * constants.documentClassHours) + (proposal.docManager_avFieldsDocClass * constants.documentClassFieldHours);
        }

        if (opportunity.automation) {
            consultingHours = consultingHours + (proposal.automation_workflows * constants.wokflowHours) + (proposal.automation_avStatesWorkflow * constants.wokflowStatesHours) + (proposal.automation_monitors * constants.monitorHours) + (proposal.automation_groups * constants.groupsHours);
        }

        // Acá se agregan los porcentajes de horas de scriptiing y prototipos si hay prototipos
        consultingHours = consultingHours + ( Math.round(((consultingHours * constants.scriptingPercentaje)/100) * 1e2) / 1e2 );

        if(opportunity.automation && proposal.automation_prototypes > 1) {
            // para el segundo protitipo
            consultingHours = consultingHours + ( Math.round(((consultingHours * constants.secondPrototypePercentaje)/100) * 1e2) / 1e2 );

            if(proposal.automation_prototypes > 2) {
                // para el tercer protitipo
                consultingHours = consultingHours + ( Math.round(((consultingHours * constants.thirdPrototypePercentaje)/100) * 1e2) / 1e2 );
            }
        }

        total = total + (consultingHours * constants.hourValue);

        // Acá se agrega al todal el número fijo de capacitación si hay que incluirlo
        if (proposal.implementation_adminsTraining) {
            total = total + constants.adminsTraining;
        }
    }

    return total;
}

function getProposalBreakdown(proposal, constants) {
    let breakdown = {
        totalCkLicenses: Math.round((proposal.newCkLicenses * constants.capitkaLicense)),
        totalThLicenses: Math.round((proposal.newThLicenses * constants.thubanLicense)),
        totalCkMaintenance: Math.round((proposal.newCkLicenses * constants.captikaMaintenance * proposal.contractDuration)),
        totalThMaintenance: Math.round((proposal.newThLicenses * constants.thubanMaintenance * proposal.contractDuration)),
        totalHoursValue: Math.round((proposal.totalHours * constants.hourValue))
    }
    
    return breakdown;
}

module.exports = {
    create,
    get,
    update,
    remove,
    breakdown
};
