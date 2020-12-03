const FM = require('../core/FieldMan');
const CM = require('../core/ContactMan');

const addField = async (req, res) => {
    let field = null;
    try {
        field = await FM.addField(req.body);
        console.log(field);
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

       console.log(field)
    } catch (e) {
      console.log(e);
      return res.status(400).json({ success: false, errors: [''] });
    }
  
    return res.status(200).json({ success: true, field });
};

module.exports = {
    addField,
    bindField,
    updateField
}