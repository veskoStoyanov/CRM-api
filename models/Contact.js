const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'New Contact',
  },
  email: String,
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
  vehicles: [{
    type: 'ObjectId',
    ref: 'Vehicle',
    default: []
  }],
  fields: [{
    type: 'ObjectId',
    ref: 'Field',
    default: []
  }],
});

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;