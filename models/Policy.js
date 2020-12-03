const mongoose = require('mongoose');

const Policychema = new mongoose.Schema({
  name: {
    type: String,
    default: 'New Policy',
  },
  price: Number,
  leads: {
    type: 'ObjectId',
    ref: 'Lead'
  },
  vehicle: {
    type: 'ObjectId',
    ref: 'Vehicle',
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

const Policy = mongoose.model('Policy', Policychema);

module.exports = Policy;