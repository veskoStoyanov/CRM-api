const mongoose = require('mongoose');

const FieldOrderSchema = new mongoose.Schema({
  entity: {
    type: String,
    require: true,
    unique: true
  },
  fields: [{
    type: 'ObjectId',
    ref: 'Field',
    default: []
  }]
});

const FieldOrder = mongoose.model('FieldOrder', FieldOrderSchema);

module.exports = FieldOrder;