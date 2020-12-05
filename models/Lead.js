const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'New Lead',
  },
  price: {
    type: Number,
    default: 0
  },
  pipe: {
    type: 'ObjectId',
    ref: 'Pipe'
  },
  product: {
    type: 'ObjectId',
    ref: 'Product'
  },
  contact: {
    type: 'ObjectId',
    ref: 'Contact'
  },
  fields: [{
    type: 'ObjectId',
    ref: 'Field'
  }],
  system: Boolean
});

const Lead = mongoose.model('Lead', LeadSchema);

module.exports = Lead;