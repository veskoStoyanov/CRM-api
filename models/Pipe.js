const mongoose = require('mongoose');

const PipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  pipeline: {
    type: 'ObjectId',
    ref: 'Pipeline',
  },
  leads: [{
    type: 'ObjectId',
    ref: 'Lead',
    default: []
  }],
});

const Pipe = mongoose.model('Pipe', PipeSchema);

module.exports = Pipe;