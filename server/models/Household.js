const mongoose = require('mongoose');

const householdSchema = new mongoose.Schema({
  enumeratorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  householdId: { type: String, required: true, unique: true },
  location: {
    county: { type: String, required: true },
    ward: { type: String, required: true },
  },
  demographics: {
    age: Number,
    gender: String,
    isSenior: Boolean
  },
  dataQuality: {
    isValid: Boolean,
    flags: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('Household', householdSchema);
