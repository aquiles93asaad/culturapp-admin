const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const ProposalSchema = new mongoose.Schema({
    estimatedTotal: {
        type: Number,
    },
    thLicenses: {
        type: Number
    },
    ckLicenses: {
        type: Number
    },
    newLicenses: {
        type: Boolean
    },
    needConsulting: {
        type: Boolean
    },
    newThLicenses: {
        type: Number
    },
    newCkLicenses: {
        type: Number
    },
    notes: {
        type: String
    },
    totalHours: {
        type: Number
    },
    isChosenProposal: {
        type: Boolean
    },
    contractDuration: {
        type: Number
    },
    digitization_docTypes: {
        type: Number
    },
    digitization_avFieldsDocType: {
        type: Number
    },
    digitization_autoRecognition: {
        type: Boolean
    },
    digitization_autoRecognitionDocs: {
        type: Number
    },
    digitization_docsPdfTextLayer: {
        type: Boolean
    },
    digitization_docsBarcode: {
        type: Boolean
    },
    digitization_extractDocsData: {
        type: Boolean
    },
    digitization_avExtractFields: {
        type: Number
    },
    docManager_docsClasses: {
        type: Number
    },
    docManager_avFieldsDocClass: {
        type: Number
    },
    docManager_storageLogic: {
        type: Boolean
    },
    automation_workflows: {
        type: Number
    },
    automation_avStatesWorkflow: {
        type: Number
    },
    automation_monitors: {
        type: Number
    },
    automation_groups: {
        type: Number
    },
    automation_prototypes: {
        type: Number,
        max: 3 
    },
    implementation_type: {
        type: String
    },
    implementation_adIntegration: {
        type: Boolean
    },
    implementation_adminsTraining: {
        type: Boolean
    },
    chosenSolution: {
        type: Schema.Types.ObjectId,
        ref: 'Solution'
    },
    solutionQuestions: [{
        label: String,
        value: Schema.Types.Mixed
    }],
    usedConstants: {
        type: Schema.Types.ObjectId,
        ref: 'Constants'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    modifiedAt: {
        type: Date
    },
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
        versionKey: false
    });


module.exports = mongoose.model('Proposal', ProposalSchema);
