const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  pipelines: [{
    type: 'ObjectId',
    ref: 'Pipeline',
    default: []
  }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
