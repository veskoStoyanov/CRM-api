const mongoose = require('mongoose');

const PipeShema = new mongoose.Schema({
  
})

const PipeLineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  leads: [{
    type: 'ObjectId',
    ref: 'Lead',
    default: []
  }],
  pipe: PipeShema
});

const Pipe = mongoose.model('Pipe', PipeLineSchema);

module.exports = Pipe;