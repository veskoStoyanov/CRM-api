const mongoose = require('mongoose');

const Vehiclechema = new mongoose.Schema({
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
});

const Vehicle = mongoose.model('Vehicle', Vehiclechema);

module.exports = Vehicle;