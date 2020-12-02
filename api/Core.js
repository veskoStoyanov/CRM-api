const H = require('../core/Handler');

const addField = async (req, res) => {
    try {
        await H.addField(req.body);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ success: false, errors: [''] });
    }
  
    return res.status(200).json({ success: true });
};

module.exports = {
    addField,
}