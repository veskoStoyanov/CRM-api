const FM = require('../core/FieldMan');

const addField = async (req, res) => {
    try {
        await FM.addField(req.body);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ success: false, errors: [''] });
    }
  
    return res.status(200).json({ success: true });
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

module.exports = {
    addField,
    bindField
}