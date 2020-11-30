const mongoose = require('mongoose');

const PipeLineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pipes: [{
    type: 'ObjectId',
    ref: 'Pipe',
    default: []
  }]
});

const Pipe = mongoose.model('Pipeline', PipeLineSchema);

module.exports = Pipe;