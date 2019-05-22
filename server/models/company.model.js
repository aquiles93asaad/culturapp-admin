const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    cuit: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    webSite: {
        type: String
    },
    address: {
        type: String
    },
    industry: {
        type: String
    },
    country: {
        type: String
    },
    type: {
        type: String,
        enum: ['small', 'medium', 'big']
    },
    origin: {
        type: String,
        enum: ['national', 'international']
    },
    employeesCount: {
        type: Number
    },
    anualBilling: {
        type: Number
    },
    hasStandard: {
        type: Boolean
    },
    branchesNumber: {
        type: Number
    },
    isClient: {
        type: Boolean
    },
    salesChannelOf: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    users: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    salesChannels: {
        type: [Schema.Types.ObjectId],
        ref: 'Company'
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
    }
}, {
        versionKey: false
    });


module.exports = mongoose.model('Company', CompanySchema);
