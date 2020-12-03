const FM = require('../core/FieldMan');
const CM = require('../core/ContactMan');

const addField = async (req, res) => {
    let field = null;
    try {
        field = await FM.addField(req.body);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ success: false, errors: [''] });
    }
  
    return res.status(200).json({ success: true, field });
};

const bindField = async (req, res) => {
    let entity = null;
    try {
        entity = await await FM.bindField(req.body);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ success: false, errors: [''] });
    }
  
    return res.status(200).json({ success: true, entity });
};

const updateField = async (req, res) => {
    const { id } = req.params;
    const {fieldId, ...rest} = req.body;
    let field = null;
    try {
        field = await await FM.getFieldById(id);
        Object.keys(rest).forEach(key => {
             field[key] = rest[key]   
        });
       
       await field.save();
    } catch (e) {
      console.log(e);
      return res.status(400).json({ success: false, errors: [''] });
    }
  
    return res.status(200).json({ success: true, field });
};

const moveField = async (req, res, next) => {
    let entity = null;
    try {
        entity = await FM.moveField(req.body)
        console.log(entity);
    } catch (e) {
        console.log(e);
    }

    return res.status(200).json({ success: true, entity });
  };

  const getBindedFields = async (req, res) => {
    let fields = null;
    try {
        fields = await FM.getBindedFields(req.params);
        console.log(fields);
    } catch (e) {
        console.log(e);
    }

    return res.status(200).json({ success: true, fields });
  };

module.exports = {
    addField,
    bindField,
    updateField,
    moveField,
    getBindedFields
}