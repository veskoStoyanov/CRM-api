const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  name: String,
  type: {
    type: String,
    default: 'string'
  }
});

const Field = mongoose.model('Field', FieldSchema);

module.exports = Field;