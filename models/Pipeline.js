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
  }],
  user: {
    type: 'ObjectId',
    ref: 'User',
  }
});

const Pipe = mongoose.model('Pipeline', PipeLineSchema);

module.exports = Pipe;