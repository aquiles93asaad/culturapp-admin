const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const OpportunitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    estimatedTotal: {
        type: Number,
    },
    automation: {
        type: Boolean,
        default: false
    },
    docManager: {
        type: Boolean,
        default: false
    },
    digitization: {
        type: Boolean,
        default: false
    },
    hardware: {
        type: Boolean,
        default: false
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    state: {
        type: String,
        enum: ['active', 'won', 'lost', 'dismissed'],
        default: 'active'
    },
    companyClient: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
    opportunityDemo: {
        type: Schema.Types.ObjectId,
        ref: 'Demo'
    },
    opportunityProposals: {
        type: [Schema.Types.ObjectId],
        ref: 'Proposal',
        maxlength: 3
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

module.exports = mongoose.model('Opportunity', OpportunitySchema);