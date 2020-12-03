const passport = require('passport');
const T = require('../core/Tools');
const CM = require('../core/ContactMan');
const FM = require('../core/FieldMan');

const createContact = async (req, res, next) => {
  let contact = null;
  try {
    const system = await CM.getContactByData({ system: true });
    if(!system) {
      contact = await CM.createContact({ system: true, name: 'SETUP' });
    } else {
      const defaultData = {
        system: false,
        fields: system.fields
      }

      contact = await CM.createContact(defaultData);
    }
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
    contacts = T.removeProps(contacts);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, contacts });
};

const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  let contact = null;
  let fields = null;
  try {
    contact = await CM.getContactById(id)
    .populate('fields');

    const fieldsInfo = await FM.getAllFields();
    fields = fieldsInfo.reduce((acc, curr) => {
      const field = contact.fields.find(x => x.name === curr.name);
      if (!field) {
        acc.push(curr);
      }

      return acc;
    }, [])
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, errors: [''] });
  }

  return res.status(200).json({ success: true, contact, fields });
};

const updateContact = async (req, res, next) => {
  // ?
  const { id } = req.params;
  const {fieldId, ...rest} = req.body;
  let contact = null;
  try {
    contact = await CM.getContactById(id);

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