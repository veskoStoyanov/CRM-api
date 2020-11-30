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
  user: {
    type: 'ObjectId',
    ref: 'User'
  },
  pipe: {
    type: 'ObjectId',
    ref: 'Pipe'
  }
});

const Lead = mongoose.model('Lead', LeadSchema);

module.exports = Lead;