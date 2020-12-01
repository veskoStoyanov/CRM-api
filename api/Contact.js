const passport = require('passport');
const T = require('../core/Tools');
const CM = require('../core/ContactMan');

const createContact = async (req, res, next) => {
  let contact = null;
  try {
    contact = await CM.createContact({})
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, contact });
};

const getAllContacts = async (req, res, next) => {
  let contacts = null;
  try {
    contacts = await CM.getAllContacts();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, contacts });
};

const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  let contact = null;
  try {
    contact = await CM.getContactById(id);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, contact });
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;
  let contact = null;
  try {
    contact = await CM.getContactById(id);

    Object.keys(updatedData)
      .forEach(key => {
        contact[key] = updatedData[key];
      });

    await contact.save();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, contact });
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    await CM.deleteContact(id)
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true });
};

module.exports = {
    createContact,
    getAllContacts,
    getOneContact,
    updateContact,
    deleteContact
};