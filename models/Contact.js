const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'New Contact',
  },
  fields: [],
  leads: [{
    type: 'ObjectId',
    ref: 'Lead',
    default: []
  }],
  products: [{
    type: 'ObjectId',
    ref: 'Product',
    default: []
  }],
});

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;