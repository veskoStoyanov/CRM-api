const passport = require('passport');
const T = require('../core/Tools');
const EM = require('../core/EntityMan');
const fieldOrderMod = 'fieldOrder'

const createEntity = async (req, res, next) => {
    let entity = null;
    const { type } = req.body
    try {    
        entity = await EM.createEntity(type, {});
    } catch (e) {
        console.log(e);
        return res.status(400).json({ success: false, errors: [''] });
    }

    return res.status(200).json({ success: true, entity });
};

const getEntities = async (req, res, next) => {
    const { type } = req.params;
    let entities = null;
    try {
        entities = await EM.getEntities(type);
    } catch (e) {
        console.log(e);
        return res.status(400).json({ success: false, errors: [''] });
    }

    entities = T.removeProps(entities);
    console.log(entities);

    return res.status(200).json({ success: true, entities });
};

const getEntity = async (req, res, next) => {
    const { id, type } = req.params;
    let entity = null;
    try {
        entity = await EM.getEntityById(type, id)
            .populate('fields');
    } catch (e) {
        console.log(e);
        return res.status(400).json({ success: false, errors: [''] });
    }

    return res.status(200).json({ success: true, entity });
};

const deleteEntity = async (req, res) => {
    const { id, type } = req.params;
    try {
      await EM.delete(type, id);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ success: false, errors: [''] });
    }
  
    return res.status(200).json({ success: true });
  };

module.exports = {
    getEntities,
    createEntity,
    getEntity,
    deleteEntity
};