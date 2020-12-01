const mongoose = require('mongoose');

const Policychema = new mongoose.Schema({
  name: {
    type: String,
    default: 'New Policy',
  },
  price: Number,
  leads: [{
    type: 'ObjectId',
    ref: 'Lead',
    default: []
  }],
  vehicle: {
    type: 'ObjectId',
    ref: 'Vehicle',
  }   
});

const Policy = mongoose.model('Policy', Policychema);

module.exports = Policy;