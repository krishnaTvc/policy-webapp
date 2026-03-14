const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  policyId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  policyType: {
    type: String,
    required: true,
    enum: ['Health', 'Life', 'Vehicle', 'Travel', 'Home'],
  },
  policyName: {
    type: String,
    required: true,
  },
  pdfBlobUrl: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  renewalStatus: {
    type: String,
    enum: ['Active', 'Expired', 'Pending Renewal'],
    default: 'Active',
  },
  premium: {
    type: Number,
    default: 0,
  },
  sumInsured: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Policy', policySchema);
