const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'New Vehicle',
  },
  age: Number,
  leads: [{
    type: 'ObjectId',
    ref: 'Lead',
    default: []
  }],
  policies: [{
    type: 'ObjectId',
    ref: 'Policy',
    default: []
  }],
  contact: {
    type: 'ObjectId',
    ref: 'Contact'
  },
  fields: [{
      type: 'ObjectId',
      ref: 'Field',
      default: []
    }],
    system: Boolean
});

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

module.exports = Vehicle;