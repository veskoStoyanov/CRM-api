const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  name: String,
  value: {
    type: 'Mixed'
  },
  type: String
});

const Field = mongoose.model('Field', FieldSchema);

module.exports = Field;