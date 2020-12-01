const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'New Lead',
  },
  price: {
   default : 0,
    type: Number
  },
  pipe: {
    type: 'ObjectId',
    ref: 'Pipe'
  },
  vehicle: {
    type: 'ObjectId',
    ref: 'Vehicle'
  },
  contact: {
    type: 'ObjectId',
    ref: 'Contact'
  },
});

const Lead = mongoose.model('Lead', LeadSchema);

module.exports = Lead;