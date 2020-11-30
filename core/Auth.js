const User = require('../models/User');

const Auth = {
    getById (id = String) {
        return User.findById(id)
    },

    getByEmail (data = Object) {
        return User.findOne(data)
    },

    create (data) {
        return User.create(data)
    },



}

module.exports = Auth;