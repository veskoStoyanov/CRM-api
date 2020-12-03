const Contact = require('../models/Contact');

const ContactMan = {
    createContact(data) {
        return Contact.create(data);
    },

    getAllContacts() {
        return Contact.find();
    },

    getContactById(id) {
        return Contact.findById(id)
    },

    getContactByData(data) {
        return Contact.findOne(data)
    },

    deleteContact(_id) {
        return Contact.deleteOne({ _id });
    }
}

module.exports =ContactMan;