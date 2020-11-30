const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  pipelines: {
    type: Array,
    default: ['main']
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
